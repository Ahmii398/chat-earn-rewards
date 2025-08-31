import { Button } from "@/components/ui/button";

const CTA = () => {
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
              className="bg-gradient-primary border-0 hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
            >
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-accent text-accent hover:bg-accent/10 text-lg px-8 py-6"
            >
              View Documentation
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