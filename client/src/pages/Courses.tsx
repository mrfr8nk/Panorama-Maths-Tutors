import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import PaymentModal from "@/components/PaymentModal";
import { useQuery } from "@tanstack/react-query";
import { courseApi, Course } from "@/lib/api";
import zimImage from "@assets/generated_images/ZIMSEC_course_thumbnail_mathematics_159fd5b3.png";
import cambImage from "@assets/generated_images/Cambridge_course_thumbnail_materials_9ebf3561.png";
import tertImage from "@assets/generated_images/Tertiary_course_thumbnail_advanced_a1e9af16.png";

const getImageForType = (type: string) => {
  if (type === "ZIMSEC") return zimImage;
  if (type === "Cambridge") return cambImage;
  return tertImage;
};

export default function Courses() {
  const [filter, setFilter] = useState<"All" | "ZIMSEC" | "Cambridge" | "Tertiary">("All");
  const [paymentModal, setPaymentModal] = useState<{ open: boolean; course?: Course }>({ open: false });

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['/api/courses'],
    queryFn: () => courseApi.getAll()
  });

  const filteredCourses = filter === "All" 
    ? courses 
    : courses.filter(course => course.type === filter);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-4">
              Our Courses
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Browse our comprehensive collection of mathematics courses
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-2">
              {(["All", "ZIMSEC", "Cambridge", "Tertiary"] as const).map((type) => (
                <Button
                  key={type}
                  variant={filter === type ? "default" : "outline"}
                  onClick={() => setFilter(type)}
                  data-testid={`filter-${type.toLowerCase()}`}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading courses...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div key={course._id} onClick={() => {
                  if (course.status === "Premium") {
                    setPaymentModal({ open: true, course });
                  }
                }}>
                  <CourseCard 
                    title={course.title}
                    description={course.description}
                    type={course.type}
                    status={course.status}
                    price={course.price ? `$${course.price.toFixed(2)}` : undefined}
                    image={getImageForType(course.type)}
                    resourceType={course.resourceType}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      
      {paymentModal.course && (
        <PaymentModal
          open={paymentModal.open}
          onOpenChange={(open) => setPaymentModal({ open, course: undefined })}
          courseName={paymentModal.course.title}
          courseId={paymentModal.course._id}
          price={paymentModal.course.price ? `$${paymentModal.course.price.toFixed(2)}` : "$0.00"}
        />
      )}
    </div>
  );
}
