import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, MessageSquare, TrendingUp, Calendar, LogOut, Bot } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Profile {
  total_points: number;
  username: string;
}

interface ChatSession {
  id: string;
  title: string;
  message_count: number;
  points_earned: number;
  created_at: string;
}

interface PointTransaction {
  id: string;
  points: number;
  transaction_type: string;
  description: string;
  created_at: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch user profile
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user,
  });

  // Fetch chat sessions
  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as ChatSession[];
    },
    enabled: !!user,
  });

  // Fetch recent point transactions
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('point_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as PointTransaction[];
    },
    enabled: !!user,
  });

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const totalMessages = sessions.reduce((sum, session) => sum + session.message_count, 0);
  const totalSessionPoints = sessions.reduce((sum, session) => sum + session.points_earned, 0);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {profile?.username || user.email}!
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/chat')} className="bg-gradient-primary hover:opacity-90">
              <Bot className="mr-2 h-4 w-4" />
              Start Chatting
            </Button>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="backdrop-blur-md bg-background/80 border-primary/20 shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Sparkles className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{profile?.total_points || 0}</div>
              <p className="text-xs text-muted-foreground">Earned through conversations</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-background/80 border-primary/20 shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chat Sessions</CardTitle>
              <MessageSquare className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sessions.length}</div>
              <p className="text-xs text-muted-foreground">Total conversations started</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-background/80 border-primary/20 shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMessages}</div>
              <p className="text-xs text-muted-foreground">Across all conversations</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-background/80 border-primary/20 shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Session Points</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSessionPoints}</div>
              <p className="text-xs text-muted-foreground">From completed sessions</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Chat Sessions */}
          <Card className="backdrop-blur-md bg-background/80 border-primary/20 shadow-elegant">
            <CardHeader>
              <CardTitle>Recent Chat Sessions</CardTitle>
              <CardDescription>Your latest AI conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.length === 0 ? (
                  <div className="text-center py-8">
                    <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No chat sessions yet.</p>
                    <Button 
                      onClick={() => navigate('/chat')} 
                      className="mt-4 bg-gradient-primary hover:opacity-90"
                    >
                      Start Your First Chat
                    </Button>
                  </div>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer"
                      onClick={() => navigate(`/chat?session=${session.id}`)}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium truncate">{session.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {session.message_count} messages • {session.points_earned} points
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(session.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Point Transactions */}
          <Card className="backdrop-blur-md bg-background/80 border-primary/20 shadow-elegant">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest point transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No activity yet.</p>
                  </div>
                ) : (
                  transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{transaction.description}</h4>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`font-semibold ${
                          transaction.transaction_type === 'earned' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.transaction_type === 'earned' ? '+' : '-'}{transaction.points}
                        </span>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;