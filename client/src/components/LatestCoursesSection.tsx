import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BookOpen, Star, Users, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function LatestCoursesSection() {
  const [, setLocation] = useLocation();
  const { data: courses, isLoading } = useQuery<any[]>({
    queryKey: ["/api/courses"],
  });

  const recentCourses = courses?.slice(0, 3) || [];

  if (isLoading || recentCourses.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold font-heading mb-2 text-foreground">Recently Uploaded</h2>
            <p className="text-muted-foreground">Check out our newest mathematics materials</p>
          </div>
          <Button variant="ghost" className="hidden md:flex" onClick={() => setLocation('/courses')}>
            See all courses <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentCourses.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col backdrop-blur-md bg-background/60 border-2 border-card-border hover:shadow-xl transition-all group">
                <CardHeader className="p-0 overflow-hidden relative aspect-video">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute top-3 left-3 z-20 flex gap-2">
                    <Badge variant={course.status === 'Free' ? 'secondary' : 'default'} className="bg-accent/90">
                      {course.status}
                    </Badge>
                    <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                      {course.type}
                    </Badge>
                  </div>
                  {course.coverPhotoUrl ? (
                    <img src={course.coverPhotoUrl} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full bg-accent/20 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-accent/40" />
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 z-20">
                     <span className="text-white font-bold text-lg drop-shadow-md line-clamp-1">{course.title}</span>
                  </div>
                </CardHeader>
                <CardContent className="p-5 flex-1">
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {course.enrollments || 0} students
                    </div>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 mr-1 text-yellow-500" />
                      {course.resourceType}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-5 pt-0">
                  <Button className="w-full" onClick={() => setLocation('/courses')}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" className="w-full" onClick={() => setLocation('/courses')}>
            See all courses
          </Button>
        </div>
      </div>
    </section>
  );
}
