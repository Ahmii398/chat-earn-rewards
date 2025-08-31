import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              cChat
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
              How it Works
            </a>
            <a href="#stats" className="text-muted-foreground hover:text-primary transition-colors">
              Stats
            </a>
          </nav>

          <div className="hidden md:flex space-x-4">
            {user ? (
              <>
                <Button 
                  variant="outline" 
                  className="mr-4"
                  onClick={() => navigate('/dashboard')}
                >
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button 
                  onClick={handleSignOut}
                  className="bg-gradient-primary hover:opacity-90 text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="mr-4"
                  onClick={() => navigate('/auth')}
                >
                  Login
                </Button>
                <Button 
                  className="bg-gradient-primary hover:opacity-90 text-white"
                  onClick={() => navigate('/auth')}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-foreground"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                How it Works
              </a>
              <a href="#stats" className="text-muted-foreground hover:text-primary transition-colors">
                Stats
              </a>
            </nav>
            <div className="flex flex-col space-y-2">
              {user ? (
                <>
                  <Button 
                    variant="outline" 
                    className="mb-4 w-full"
                    onClick={() => navigate('/dashboard')}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button 
                    onClick={handleSignOut}
                    className="bg-gradient-primary hover:opacity-90 text-white w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    className="mb-4 w-full"
                    onClick={() => navigate('/auth')}
                  >
                    Login
                  </Button>
                  <Button 
                    className="bg-gradient-primary hover:opacity-90 text-white w-full"
                    onClick={() => navigate('/auth')}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;