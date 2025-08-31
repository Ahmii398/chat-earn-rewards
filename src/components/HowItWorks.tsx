import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, MessageCircle, Gift } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      step: "01",
      title: "Create Account",
      description: "Sign up with your Web3 wallet or email. Set up your profile and connect to the cChat ecosystem.",
    },
    {
      icon: MessageCircle,
      step: "02",
      title: "Start Chatting",
      description: "Engage with our AI models on any topic. Ask questions, have debates, or explore creative ideas.",
    },
    {
      icon: Gift,
      step: "03",
      title: "Earn Rewards",
      description: "Watch your cTokens grow with every interaction. Quality conversations earn bonus multipliers.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-muted/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            How <span className="bg-gradient-accent bg-clip-text text-transparent">cChat</span> Works
          </h2>
          <p className="text-xl text-muted-foreground">
            Getting started is simple. Three easy steps to begin earning rewards through AI conversations.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="bg-gradient-card border-border hover:shadow-card transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="relative mb-8">
                    <div className="flex items-center justify-center w-20 h-20 bg-gradient-accent rounded-full mx-auto mb-4 group-hover:shadow-accent-glow transition-all duration-300">
                      <step.icon className="w-10 h-10 text-accent-foreground" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-primary transform -translate-y-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;