import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GraduationCap, BookOpen, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const courses = [
  {
    icon: GraduationCap,
    title: "ZIMSEC O' & A' Level",
    description: "Comprehensive preparation for ZIMSEC examinations with proven success rates"
  },
  {
    icon: BookOpen,
    title: "Cambridge O' & A Level",
    description: "International curriculum focused on Cambridge examination standards"
  },
  {
    icon: Award,
    title: "Tertiary/Professional Maths",
    description: "Advanced mathematics for university and professional qualification courses"
  }
];

// Placeholder for the onViewCourses function
const onViewCourses = () => {
  console.log("View All Courses button clicked!");
  // In a real application, this would navigate to the courses page
};

export default function CoursesOfferedSection() {
  return (
    <section className="py-16 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
            Courses Offered
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Expertly designed programs for every level of mathematics education
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <Card
              key={index}
              className="backdrop-blur-md bg-background/80 border-2 border-card-border hover-elevate active-elevate-2 transition-all duration-300"
            >
              <CardHeader>
                <div className="w-16 h-16 rounded-md bg-accent/20 flex items-center justify-center mb-4 mx-auto">
                  <course.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-heading font-bold text-xl text-center text-foreground">
                  {course.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">{course.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="font-medium" onClick={onViewCourses}>
            View All Courses
          </Button>
        </div>
      </div>
    </section>
  );
}