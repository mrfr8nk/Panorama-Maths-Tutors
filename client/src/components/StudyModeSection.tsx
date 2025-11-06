import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Video, Clock, Users, Home } from "lucide-react";

const studyModes = [
  {
    icon: Video,
    title: "Online Tutorials",
    description: "Learn from anywhere with our interactive online sessions"
  },
  {
    icon: Clock,
    title: "Evening Sessions",
    description: "Convenient working class evening study groups"
  },
  {
    icon: Users,
    title: "One-on-One Sessions",
    description: "Personalized attention with individual tutoring"
  },
  {
    icon: Home,
    title: "Home Visits",
    description: "Professional tutors come to your location"
  }
];

export default function StudyModeSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
            Mode of Study
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the learning format that works best for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {studyModes.map((mode, index) => (
            <Card 
              key={index} 
              className="backdrop-blur-sm bg-card/60 hover-elevate transition-all duration-300 hover:scale-105"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <mode.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground">
                  {mode.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{mode.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
