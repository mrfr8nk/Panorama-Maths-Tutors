import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Video, Lock, CheckCircle2 } from "lucide-react";

interface CourseCardProps {
  title: string;
  description: string;
  type: "ZIMSEC" | "Cambridge" | "Tertiary";
  status: "Free" | "Premium";
  price?: string;
  image: string;
  resourceType: "PDF" | "Video" | "Lesson";
}

export default function CourseCard({
  title,
  description,
  type,
  status,
  price,
  image,
  resourceType
}: CourseCardProps) {
  const getIcon = () => {
    switch (resourceType) {
      case "PDF":
        return <BookOpen className="w-5 h-5" />;
      case "Video":
        return <Video className="w-5 h-5" />;
      case "Lesson":
        return <CheckCircle2 className="w-5 h-5" />;
    }
  };

  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm bg-card/80 border-card-border">
      <div 
        className="h-48 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge 
            variant={status === "Free" ? "default" : "secondary"}
            className="backdrop-blur-md"
          >
            {status}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3">
          <Badge variant="outline" className="backdrop-blur-md bg-background/80">
            {type}
          </Badge>
        </div>
      </div>
      
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-semibold text-lg text-foreground">{title}</h3>
          <div className="text-primary mt-1">
            {getIcon()}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground text-sm">{description}</p>
        {price && status === "Premium" && (
          <p className="text-accent font-semibold mt-3 text-lg">{price}</p>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full gap-2" 
          variant={status === "Free" ? "default" : "secondary"}
          data-testid={`button-enroll-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {status === "Premium" ? <Lock className="w-4 h-4" /> : null}
          {status === "Free" ? "Access Now" : "Enroll"}
        </Button>
      </CardFooter>
    </Card>
  );
}
