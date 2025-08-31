import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!openAIApiKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { message, sessionId } = await req.json();
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Get user from JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid user token');
    }

    console.log(`Processing chat message for user: ${user.id}`);

    // Get or create chat session
    let session;
    if (sessionId) {
      const { data } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single();
      session = data;
    }

    if (!session) {
      const { data: newSession, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: message.substring(0, 50) + '...',
        })
        .select()
        .single();

      if (sessionError) throw sessionError;
      session = newSession;

      // Award points for starting new chat
      await supabase.from('point_transactions').insert({
        user_id: user.id,
        points: 5,
        transaction_type: 'earned',
        description: 'Started new chat session',
        session_id: session.id,
      });
    }

    // Save user message
    const { error: userMsgError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: session.id,
        user_id: user.id,
        role: 'user',
        content: message,
        points_awarded: 1,
      });

    if (userMsgError) throw userMsgError;

    // Get chat history for context
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('session_id', session.id)
      .order('created_at', { ascending: true })
      .limit(20);

    // Prepare messages for OpenAI
    const chatMessages = [
      {
        role: 'system',
        content: 'You are a helpful AI assistant in cChat, a Web3-powered platform where users earn points for engaging conversations. Be conversational, helpful, and encourage meaningful dialogue. Keep responses concise but engaging.',
      },
      ...(messages || []).map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: chatMessages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const aiResponse = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', aiResponse);
      throw new Error('Failed to get AI response');
    }

    const aiMessage = aiResponse.choices[0].message.content;

    // Save AI response
    const { error: aiMsgError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: session.id,
        user_id: user.id,
        role: 'assistant',
        content: aiMessage,
      });

    if (aiMsgError) throw aiMsgError;

    // Update session stats and award points
    const messageCount = (messages?.length || 0) + 2; // +2 for user msg and AI response
    let pointsEarned = 1; // Base points for message

    // Bonus points for longer conversations
    if (messageCount >= 10) pointsEarned += 2;
    if (messageCount >= 20) pointsEarned += 3;

    await supabase
      .from('chat_sessions')
      .update({
        message_count: messageCount,
        points_earned: session.points_earned + pointsEarned,
      })
      .eq('id', session.id);

    // Award points to user
    await supabase.from('point_transactions').insert({
      user_id: user.id,
      points: pointsEarned,
      transaction_type: 'earned',
      description: `Chat message (${pointsEarned} pts)`,
      session_id: session.id,
    });

    // Update user's total points
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_points')
      .eq('user_id', user.id)
      .single();

    await supabase
      .from('profiles')
      .update({
        total_points: (profile?.total_points || 0) + pointsEarned,
      })
      .eq('user_id', user.id);

    return new Response(JSON.stringify({
      message: aiMessage,
      sessionId: session.id,
      pointsEarned,
      totalPoints: (profile?.total_points || 0) + pointsEarned,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});