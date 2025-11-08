import { useState, useEffect } from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BookOpen, FileText, DollarSign, User, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { courseApi } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const menuItems = [
  { title: "My Courses", icon: BookOpen, id: "courses" },
  { title: "Resources", icon: FileText, id: "resources" },
  { title: "Payments", icon: DollarSign, id: "payments" },
  { title: "Profile", icon: User, id: "profile" },
];

export default function StudentDashboard() {
  const [activeSection, setActiveSection] = useState("courses");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { user } = useAuth();

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['/api/auth/me'],
    enabled: activeSection === "courses" || activeSection === "profile",
  });

  const enrolledCourses = userData?.enrolledCourses || [];
  const coursesLoading = userLoading;

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
                          if (window.innerWidth < 768) {
                            document.querySelector('[data-testid="button-sidebar-toggle"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
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
                <div className="text-muted-foreground">Your resources will appear here...</div>
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
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input value={user?.name || ''} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={user?.email || ''} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>Education Level</Label>
                        <Select value={user?.educationLevel || ''} disabled>
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
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
