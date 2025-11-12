import { useState, useEffect } from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BookOpen, FileText, DollarSign, User, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { courseApi, Course } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import ContentGallery from "@/components/ContentGallery";
import SuggestedContent from "@/components/SuggestedContent";
import PaymentModal from "@/components/PaymentModal";
import DownloadModal from "@/components/DownloadModal";
import { useLocation } from "wouter";

const menuItems = [
  { title: "My Courses", icon: BookOpen, id: "courses" },
  { title: "Resources", icon: FileText, id: "resources" },
  { title: "Payments", icon: DollarSign, id: "payments" },
  { title: "Profile", icon: User, id: "profile" },
];

export default function StudentDashboard() {
  const [activeSection, setActiveSection] = useState("courses");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [paymentModal, setPaymentModal] = useState<{ open: boolean; course?: Course }>({ open: false });
  const [downloadModal, setDownloadModal] = useState<{ open: boolean; course?: Course }>({ open: false });
  const [profileData, setProfileData] = useState({
    phoneNumber: "",
    address: "",
    school: "",
    gradeLevel: "",
    guardianName: "",
    guardianContact: ""
  });
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: userData, isLoading: userLoading } = useQuery<any>({
    queryKey: ['/api/auth/me'],
    enabled: activeSection === "courses" || activeSection === "profile" || activeSection === "resources",
  });

  const { data: allCourses, isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
    enabled: activeSection === "resources"
  });

  const enrolledCourses = userData?.enrolledCourses || [];
  const enrolledCourseIds = enrolledCourses.map((c: any) => c._id || c);

  useEffect(() => {
    if (userData) {
      setProfileData({
        phoneNumber: userData.phoneNumber || "",
        address: userData.address || "",
        school: userData.school || "",
        gradeLevel: userData.gradeLevel || "",
        guardianName: userData.guardianName || "",
        guardianContact: userData.guardianContact || ""
      });
    }
  }, [userData]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="font-heading text-lg mb-2">Student Panel</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => {
                          setActiveSection(item.id);
                          // Close sidebar on mobile
                          const sidebarToggle = document.querySelector('[data-testid="button-sidebar-toggle"]') as HTMLElement;
                          if (sidebarToggle && window.innerWidth < 768) {
                            sidebarToggle.click();
                          }
                        }}
                        isActive={activeSection === item.id}
                        data-testid={`sidebar-${item.id}`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b border-border backdrop-blur-sm bg-background/80">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Welcome back, <span className="font-medium text-foreground">{user?.name || "Student"}</span></span>
              <Button variant="ghost" size="icon" onClick={toggleTheme} data-testid="button-theme-toggle">
                {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  localStorage.removeItem('auth_token');
                  window.location.href = '/';
                }}
              >
                Logout
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="font-heading font-bold text-3xl mb-6 text-foreground">
                {menuItems.find(item => item.id === activeSection)?.title || "My Courses"}
              </h1>
              
              {activeSection === "courses" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coursesLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <Card key={i} className="backdrop-blur-sm bg-card/80">
                        <CardHeader>
                          <Skeleton className="h-6 w-3/4" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-8 w-full" />
                        </CardContent>
                      </Card>
                    ))
                  ) : enrolledCourses && enrolledCourses.length > 0 ? (
                    enrolledCourses.map((course: any) => (
                      <Card key={course._id} className="backdrop-blur-sm bg-card/80" data-testid={`card-course-${course._id}`}>
                        <CardHeader>
                          <CardTitle>{course.title}</CardTitle>
                          <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <Badge variant={course.status === 'Free' ? 'default' : 'secondary'}>
                              {course.status}
                            </Badge>
                            <Button size="sm" data-testid="button-view-course">View Course</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center text-muted-foreground py-12">
                      <p>No courses available. Browse the courses page to enroll in courses.</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeSection === "resources" && (
                <div className="space-y-8">
                  {coursesLoading || userLoading ? (
                    <div className="text-center text-muted-foreground">Loading resources...</div>
                  ) : allCourses && allCourses.length > 0 ? (
                    <>
                      <ContentGallery
                        courses={allCourses}
                        onEnroll={async (courseId) => {
                          const course = allCourses.find(c => c._id === courseId);
                          if (!course) return;

                          if (course.status === 'Premium') {
                            setPaymentModal({ open: true, course });
                          } else {
                            try {
                              const response = await fetch(`/api/courses/${courseId}/enroll`, {
                                method: 'POST',
                                headers: {
                                  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                                  'Content-Type': 'application/json'
                                }
                              });

                              if (response.ok) {
                                queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
                                queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
                              }
                            } catch (error) {
                              console.error('Enrollment failed:', error);
                            }
                          }
                        }}
                        onDownload={(course) => {
                          if (enrolledCourseIds.includes(course._id)) {
                            setDownloadModal({ open: true, course });
                          }
                        }}
                        title="All Available Resources"
                        userEnrolledCourses={enrolledCourseIds}
                      />

                      <SuggestedContent
                        allCourses={allCourses}
                        userEnrolledCourses={enrolledCourseIds}
                        onEnroll={async (courseId) => {
                          const course = allCourses.find(c => c._id === courseId);
                          if (!course) return;

                          if (course.status === 'Premium') {
                            setPaymentModal({ open: true, course });
                          } else {
                            try {
                              const response = await fetch(`/api/courses/${courseId}/enroll`, {
                                method: 'POST',
                                headers: {
                                  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                                  'Content-Type': 'application/json'
                                }
                              });

                              if (response.ok) {
                                queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
                                queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
                              }
                            } catch (error) {
                              console.error('Enrollment failed:', error);
                            }
                          }
                        }}
                        onDownload={(course) => {
                          if (enrolledCourseIds.includes(course._id)) {
                            setDownloadModal({ open: true, course });
                          }
                        }}
                        maxSuggestions={6}
                      />
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground py-12">
                      <p>No resources available yet.</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeSection === "payments" && (
                <div className="space-y-4">
                  <Card className="backdrop-blur-sm bg-card/80">
                    <CardHeader>
                      <CardTitle>Payment History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">No payment history available yet.</p>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {activeSection === "profile" && (
                <div className="space-y-6">
                  <Card className="backdrop-blur-sm bg-card/80">
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input value={userData?.name || ''} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input value={userData?.email || ''} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label>Education Level</Label>
                          <Select value={userData?.educationLevel || ''} disabled>
                            <SelectTrigger>
                              <SelectValue placeholder="Select education level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="High School">High School</SelectItem>
                              <SelectItem value="University">University</SelectItem>
                              <SelectItem value="College">College</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Phone Number</Label>
                          <Input 
                            value={profileData.phoneNumber}
                            onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                            placeholder="e.g., +2637 1234 5678"
                            disabled
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Address</Label>
                          <Textarea 
                            value={profileData.address}
                            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                            placeholder="Your address"
                            rows={2}
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>School/Institution</Label>
                          <Input 
                            value={profileData.school}
                            onChange={(e) => setProfileData({ ...profileData, school: e.target.value })}
                            placeholder="e.g., Churchill High School"
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Grade/Year Level</Label>
                          <Input 
                            value={profileData.gradeLevel}
                            onChange={(e) => setProfileData({ ...profileData, gradeLevel: e.target.value })}
                            placeholder="e.g., Form 4, Year 2"
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Guardian Name</Label>
                          <Input 
                            value={profileData.guardianName}
                            onChange={(e) => setProfileData({ ...profileData, guardianName: e.target.value })}
                            placeholder="Parent/Guardian full name"
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Guardian Contact</Label>
                          <Input 
                            value={profileData.guardianContact}
                            onChange={(e) => setProfileData({ ...profileData, guardianContact: e.target.value })}
                            placeholder="Guardian phone/email"
                            disabled
                          />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-4">
                        Contact admin to update your profile information
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

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
    </SidebarProvider>
  );
}
