import { motion } from "framer-motion";
import { Course } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Clock, Download, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ContentGalleryProps {
  courses: Course[];
  onEnroll: (courseId: string) => void;
  onDownload?: (course: Course) => void;
  title?: string;
  showSuggestions?: boolean;
  userEnrolledCourses?: string[];
}

export default function ContentGallery({ 
  courses, 
  onEnroll, 
  onDownload,
  title = "Available Content",
  showSuggestions = false,
  userEnrolledCourses = []
}: ContentGalleryProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    },
    hover: {
      y: -8,
      transition: {
        type: "spring",
        stiffness: 400
      }
    }
  };

  const isEnrolled = (courseId: string) => userEnrolledCourses.includes(courseId);
  const isPremium = (course: Course) => course.status === 'Premium';

  return (
    <div className="space-y-8">
      <h2 className="font-heading text-2xl font-bold">{title}</h2>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {courses.map((course) => (
          <motion.div
            key={course._id}
            variants={cardVariants}
            whileHover="hover"
            data-testid={`card-content-${course._id}`}
          >
            <Card className="backdrop-blur-sm bg-card/80 overflow-hidden h-full flex flex-col">
              {course.coverPhotoUrl && (
                <div className="relative w-full h-48 overflow-hidden">
                  <img 
                    src={course.coverPhotoUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  {isPremium(course) && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
                        <Crown className="w-3 h-3 mr-1" />
                        PRO
                      </Badge>
                    </div>
                  )}
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  {!course.coverPhotoUrl && isPremium(course) && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0 shrink-0">
                      <Crown className="w-3 h-3 mr-1" />
                      PRO
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{course.type}</Badge>
                  <Badge variant="secondary">{course.resourceType}</Badge>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col justify-end space-y-3">
                {course.uploadedAt && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDistanceToNow(new Date(course.uploadedAt), { addSuffix: true })}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  {isPremium(course) && course.price && (
                    <span className="text-lg font-bold text-primary">${course.price.toFixed(2)}</span>
                  )}
                  {!isPremium(course) && (
                    <Badge variant="default">Free</Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  {isEnrolled(course._id) ? (
                    <>
                      <Button
                        size="sm"
                        className="flex-1"
                        variant="outline"
                        data-testid="button-enrolled"
                        disabled
                      >
                        Enrolled
                      </Button>
                      {onDownload && course.resourceType !== 'Lesson' && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => onDownload(course)}
                          data-testid="button-download"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                      {course.youtubeLink && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => window.open(course.youtubeLink, '_blank')}
                          data-testid="button-watch"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => onEnroll(course._id)}
                      data-testid={`button-enroll-${course._id}`}
                    >
                      {isPremium(course) ? `Get for $${course.price?.toFixed(2)}` : 'Enroll Free'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
