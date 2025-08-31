import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const CTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-gradient-hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            Ready to Start <span className="bg-gradient-accent bg-clip-text text-transparent">Earning?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users already earning cTokens through AI conversations. 
            The future of rewarded interaction starts here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:opacity-90 text-white mr-4"
              onClick={() => navigate('/auth')}
            >
              Start Earning Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary"
              onClick={() => navigate('/chat')}
            >
              Try Demo
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • Start earning immediately • Web3 powered
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;