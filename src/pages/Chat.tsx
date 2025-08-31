import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Send, Loader2, Sparkles, Bot, User } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  points_awarded?: number;
}

interface ChatSession {
  id: string;
  title: string;
  message_count: number;
  points_earned: number;
}

const Chat = () => {
  const [message, setMessage] = useState("");
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
    };
    checkAuth();
  }, [navigate]);

  // Fetch messages for current session
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', currentSessionId],
    queryFn: async () => {
      if (!currentSessionId) return [];
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', currentSessionId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Message[];
    },
    enabled: !!currentSessionId && !!user,
  });

  // Fetch user's chat sessions
  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as ChatSession[];
    },
    enabled: !!user,
  });

  // Fetch user profile for points
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('total_points')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('ai-chat', {
        body: {
          message: messageText,
          sessionId: currentSessionId,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data) => {
      setCurrentSessionId(data.sessionId);
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      toast({
        title: "Points Earned!",
        description: `You earned ${data.pointsEarned} points! Total: ${data.totalPoints}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sendMessageMutation.isPending) return;

    const messageText = message.trim();
    setMessage("");
    sendMessageMutation.mutate(messageText);
  };

  const startNewChat = () => {
    setCurrentSessionId(null);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">cChat AI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 px-4 py-2 rounded-full">
              <span className="text-primary font-semibold">
                {profile?.total_points || 0} points
              </span>
            </div>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              Dashboard
            </Button>
            <Button onClick={startNewChat} variant="outline">
              New Chat
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Chat Sessions */}
          <div className="lg:col-span-1">
            <Card className="p-4 backdrop-blur-md bg-background/80 border-primary/20">
              <h3 className="font-semibold mb-4 text-foreground">Recent Chats</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sessions.map((session) => (
                  <Button
                    key={session.id}
                    variant={currentSessionId === session.id ? "default" : "ghost"}
                    className="w-full justify-start text-left"
                    onClick={() => setCurrentSessionId(session.id)}
                  >
                    <div className="truncate">
                      <div className="font-medium">{session.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {session.message_count} messages • {session.points_earned} pts
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="backdrop-blur-md bg-background/80 border-primary/20 shadow-elegant">
              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <Bot className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Start a conversation!
                      </h3>
                      <p className="text-muted-foreground">
                        Chat with AI and earn points for every message.
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {msg.role === 'assistant' ? (
                            <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                          ) : (
                            <User className="h-4 w-4 mt-1 flex-shrink-0" />
                          )}
                          <div>
                            <p className="text-sm">{msg.content}</p>
                            {msg.points_awarded && msg.points_awarded > 0 && (
                              <span className="text-xs opacity-70">
                                +{msg.points_awarded} pts
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-primary/20 p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-background/50 border-primary/20 focus:border-primary"
                    disabled={sendMessageMutation.isPending}
                  />
                  <Button
                    type="submit"
                    disabled={!message.trim() || sendMessageMutation.isPending}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;