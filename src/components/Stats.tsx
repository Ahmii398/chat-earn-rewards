import { Card, CardContent } from "@/components/ui/card";

const Stats = () => {
  const stats = [
    {
      number: "50,000+",
      label: "Active Users",
      description: "Growing community of AI enthusiasts",
    },
    {
      number: "$2.5M+",
      label: "Rewards Distributed",
      description: "Total value earned by users",
    },
    {
      number: "1M+",
      label: "Conversations",
      description: "AI interactions and counting",
    },
    {
      number: "95%",
      label: "User Satisfaction",
      description: "Based on community feedback",
    },
    {
      number: "24/7",
      label: "AI Availability",
      description: "Always-on conversational AI",
    },
    {
      number: "0.01¢",
      label: "Cost Per Message",
      description: "Incredibly affordable AI access",
    },
  ];

  return (
    <section id="stats" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Platform <span className="bg-gradient-primary bg-clip-text text-transparent">Statistics</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Join a thriving ecosystem where AI meets Web3 rewards. See what our community has achieved.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gradient-card border-border hover:shadow-card transition-all duration-300 group text-center">
              <CardContent className="p-8">
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{stat.label}</h3>
                <p className="text-muted-foreground text-sm">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;