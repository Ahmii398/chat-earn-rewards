import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <Button variant="ghost">
              Login
            </Button>
            <Button className="bg-gradient-primary border-0 hover:shadow-glow transition-all duration-300">
              Get Started
            </Button>
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
              <Button variant="ghost" className="w-full">
                Login
              </Button>
              <Button className="w-full bg-gradient-primary border-0 hover:shadow-glow transition-all duration-300">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;