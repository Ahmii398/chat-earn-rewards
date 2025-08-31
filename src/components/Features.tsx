import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Coins, Shield, Zap, Users, TrendingUp } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "AI-Powered Conversations",
      description: "Chat with advanced AI models trained on diverse topics. Get intelligent responses that adapt to your style.",
    },
    {
      icon: Coins,
      title: "Earn While You Chat",
      description: "Every message earns you cTokens. The more engaging your conversations, the more rewards you collect.",
    },
    {
      icon: Shield,
      title: "Web3 Security",
      description: "Your rewards are secured on blockchain. Full transparency and ownership of your earned tokens.",
    },
    {
      icon: Zap,
      title: "Instant Rewards",
      description: "Real-time reward distribution. See your cTokens accumulate with every interaction.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join a thriving community of AI enthusiasts earning rewards through meaningful conversations.",
    },
    {
      icon: TrendingUp,
      title: "Growing Ecosystem",
      description: "Use your cTokens across our expanding ecosystem of AI-powered Web3 applications.",
    },
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Why Choose <span className="bg-gradient-primary bg-clip-text text-transparent">cChat?</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Experience the perfect blend of AI technology and Web3 rewards. Join thousands earning while they chat.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gradient-card border-border hover:shadow-card transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-6 group-hover:shadow-glow transition-all duration-300">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;