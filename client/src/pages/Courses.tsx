import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import PaymentModal from "@/components/PaymentModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { courseApi, Course } from "@/lib/api";
import zimImage from "@assets/generated_images/ZIMSEC_course_thumbnail_mathematics_159fd5b3.png";
import cambImage from "@assets/generated_images/Cambridge_course_thumbnail_materials_9ebf3561.png";
import tertImage from "@assets/generated_images/Tertiary_course_thumbnail_advanced_a1e9af16.png";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import DownloadModal from "@/components/DownloadModal";

const getImageForType = (type: string) => {
  if (type === "ZIMSEC") return zimImage;
  if (type === "Cambridge") return cambImage;
  return tertImage;
};

export default function Courses() {
  const [filter, setFilter] = useState<"All" | "ZIMSEC" | "Cambridge" | "Tertiary">("All");
  const [paymentModal, setPaymentModal] = useState<{ open: boolean; course?: Course }>({ open: false });
  const [downloadModal, setDownloadModal] = useState<{ open: boolean; course?: Course }>({ open: false });
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['/api/courses'],
    queryFn: () => courseApi.getAll()
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: () => fetch('/api/stats', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    }).then(res => res.json()),
    enabled: !!localStorage.getItem('auth_token')
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/users'],
    queryFn: () => fetch('/api/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    }).then(res => res.json()),
    enabled: !!localStorage.getItem('auth_token')
  });


  const handleEnroll = async (courseId: string) => {
    if (!user) {
      router.push('/auth');
      return;
    }

    const course = courses?.find((c: any) => c._id === courseId);
    if (!course) return;

    // Premium courses must go through payment
    if (course.status === 'Premium') {
      setPaymentModal({ open: true, course });
      return;
    }

    // Free courses can be enrolled directly
    try {
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Enrollment failed');
      }

      // Refresh user data and courses
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
    } catch (error) {
      console.error('Enrollment failed:', error);
    }
  };

  const handleDownload = (course: Course) => {
    if (course.resourceType === 'Uploaded') {
      setDownloadModal({ open: true, course });
    }
  };

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

          {(isLoading || authLoading || statsLoading || usersLoading) ? (
            <div className="text-center text-muted-foreground">Loading...</div>
          ) : (
            <>
              {/* Stats Section */}
              {statsData && (
                <div className="mb-12 bg-background p-6 rounded-lg shadow-md">
                  <h2 className="font-heading font-bold text-2xl text-foreground mb-4">Statistics</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <div className="p-4 bg-accent rounded-lg text-center">
                      <p className="text-muted-foreground uppercase text-sm font-semibold">Total Courses</p>
                      <p className="text-3xl font-bold text-primary">{statsData.totalCourses}</p>
                    </div>
                    <div className="p-4 bg-accent rounded-lg text-center">
                      <p className="text-muted-foreground uppercase text-sm font-semibold">Total Students</p>
                      <p className="text-3xl font-bold text-primary">{statsData.totalStudents}</p>
                    </div>
                    <div className="p-4 bg-accent rounded-lg text-center">
                      <p className="text-muted-foreground uppercase text-sm font-semibold">Enrollments Today</p>
                      <p className="text-3xl font-bold text-primary">{statsData.todayEnrollments}</p>
                    </div>
                    <div className="p-4 bg-accent rounded-lg text-center">
                      <p className="text-muted-foreground uppercase text-sm font-semibold">Revenue Today</p>
                      <p className="text-3xl font-bold text-primary">${statsData.todayRevenue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Users Section */}
              {usersData && (
                <div className="mb-12 bg-background p-6 rounded-lg shadow-md">
                  <h2 className="font-heading font-bold text-2xl text-foreground mb-4">Registered Users</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {usersData.map((user: any) => (
                          <tr key={user._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <div key={course._id}>
                    <div className="relative" onClick={() => handleEnroll(course._id)}>
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
                    {course.resourceType === 'Uploaded' && (
                      <Button onClick={() => handleDownload(course)} className="mt-2 w-full">
                        Download Course
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </>
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

      {downloadModal.course && (
        <DownloadModal
          open={downloadModal.open}
          onOpenChange={(open) => setDownloadModal({ open, course: undefined })}
          courseId={downloadModal.course._id}
          courseTitle={downloadModal.course.title}
        />
      )}
    </div>
  );
}