import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import zimImage from "@assets/generated_images/ZIMSEC_course_thumbnail_mathematics_159fd5b3.png";
import cambImage from "@assets/generated_images/Cambridge_course_thumbnail_materials_9ebf3561.png";
import tertImage from "@assets/generated_images/Tertiary_course_thumbnail_advanced_a1e9af16.png";
import PaymentModal from "@/components/PaymentModal";

const allCourses = [
  {
    id: "1",
    title: "ZIMSEC O Level Algebra",
    description: "Master algebraic concepts for ZIMSEC O Level examinations with comprehensive notes and practice problems.",
    type: "ZIMSEC" as const,
    status: "Free" as const,
    image: zimImage,
    resourceType: "PDF" as const
  },
  {
    id: "2",
    title: "ZIMSEC A Level Calculus",
    description: "Advanced calculus course covering differentiation and integration for A Level students.",
    type: "ZIMSEC" as const,
    status: "Premium" as const,
    price: "$20.00",
    image: zimImage,
    resourceType: "Video" as const
  },
  {
    id: "3",
    title: "Cambridge IGCSE Mathematics",
    description: "Complete preparation for Cambridge IGCSE Mathematics examinations with detailed study materials.",
    type: "Cambridge" as const,
    status: "Free" as const,
    image: cambImage,
    resourceType: "PDF" as const
  },
  {
    id: "4",
    title: "Cambridge A Level Pure Maths",
    description: "Comprehensive A Level Pure Mathematics course with video tutorials and solved examples.",
    type: "Cambridge" as const,
    status: "Premium" as const,
    price: "$30.00",
    image: cambImage,
    resourceType: "Video" as const
  },
  {
    id: "5",
    title: "Tertiary Linear Algebra",
    description: "University-level linear algebra covering vector spaces, matrices, and transformations.",
    type: "Tertiary" as const,
    status: "Premium" as const,
    price: "$35.00",
    image: tertImage,
    resourceType: "Lesson" as const
  },
  {
    id: "6",
    title: "Tertiary Differential Equations",
    description: "Advanced study of ordinary and partial differential equations for university students.",
    type: "Tertiary" as const,
    status: "Premium" as const,
    price: "$40.00",
    image: tertImage,
    resourceType: "Video" as const
  }
];

export default function Courses() {
  const [filter, setFilter] = useState<"All" | "ZIMSEC" | "Cambridge" | "Tertiary">("All");
  const [paymentModal, setPaymentModal] = useState<{ open: boolean; course?: typeof allCourses[0] }>({ open: false });

  const filteredCourses = filter === "All" 
    ? allCourses 
    : allCourses.filter(course => course.type === filter);

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} onClick={() => {
                if (course.status === "Premium") {
                  setPaymentModal({ open: true, course });
                }
              }}>
                <CourseCard {...course} />
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      
      {paymentModal.course && (
        <PaymentModal
          open={paymentModal.open}
          onOpenChange={(open) => setPaymentModal({ open, course: undefined })}
          courseName={paymentModal.course.title}
          price={paymentModal.course.price || ""}
        />
      )}
    </div>
  );
}
