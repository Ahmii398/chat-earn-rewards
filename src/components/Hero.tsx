import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-hero pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left space-y-8">
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Chat with AI,
              <span className="bg-gradient-primary bg-clip-text text-transparent block">
                Earn Rewards
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl">
              Experience the future of AI conversations on cChat. Every message you send earns you crypto rewards. 
              Join the Web3 AI revolution and get paid to chat.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-gradient-primary border-0 hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
              >
                Start Earning Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/10 text-lg px-8 py-6"
              >
                Learn More
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center lg:justify-start text-center">
              <div>
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-muted-foreground">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">$2.5M+</div>
                <div className="text-muted-foreground">Rewards Distributed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">1M+</div>
                <div className="text-muted-foreground">Conversations</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full"></div>
            <img 
              src={heroImage} 
              alt="cChat AI Interface" 
              className="relative z-10 rounded-2xl shadow-card w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;