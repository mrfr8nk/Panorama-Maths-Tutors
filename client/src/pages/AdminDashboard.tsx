import { useState, useEffect } from "react";
import { useNavigate } from "wouter";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutDashboard, Upload, BookOpen, DollarSign, Users, Settings, Moon, Sun } from "lucide-react";
import DashboardStats from "@/components/DashboardStats";
import UploadModal from "@/components/UploadModal";
import CourseTable from "@/components/CourseTable";
import UsersTable from "@/components/UsersTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { title: "Upload Content", icon: Upload, id: "upload" },
  { title: "Manage Courses", icon: BookOpen, id: "courses" },
  { title: "Payments", icon: DollarSign, id: "payments" },
  { title: "Users", icon: Users, id: "users" },
  { title: "Settings", icon: Settings, id: "settings" },
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { user } = useAuth();
  const navigate = useNavigate();

  // Protect admin route
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else if (user.role !== 'admin') {
      navigate('/student');
    }
  }, [user, navigate]);

  // Show loading while checking auth
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return null;
  }

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/analytics/stats'],
  });

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
              <SidebarGroupLabel className="font-heading text-lg mb-2">Admin Panel</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => {
                          setActiveSection(item.id);
                          if (item.id === "upload") setUploadModalOpen(true);
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
            <div className="flex items-center gap-2">
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
                {menuItems.find(item => item.id === activeSection)?.title || "Dashboard"}
              </h1>
              
              {activeSection === "dashboard" && <DashboardStats />}
              {activeSection === "courses" && <CourseTable />}
              {activeSection === "payments" && (
                <div className="space-y-4">
                  <Card className="backdrop-blur-sm bg-card/80">
                    <CardHeader>
                      <CardTitle>Payment Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        View and manage all payment transactions from students.
                      </p>
                      {statsLoading ? (
                        <div className="space-y-2">
                          <Skeleton className="h-20 w-full" />
                          <Skeleton className="h-20 w-full" />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-3 border rounded-md">
                            <div>
                              <p className="font-medium">Total Revenue</p>
                              <p className="text-sm text-muted-foreground">All time</p>
                            </div>
                            <p className="text-2xl font-bold">${stats?.totalRevenue || 0}</p>
                          </div>
                          <div className="flex justify-between items-center p-3 border rounded-md">
                            <div>
                              <p className="font-medium">Pending Payments</p>
                              <p className="text-sm text-muted-foreground">Awaiting confirmation</p>
                            </div>
                            <p className="text-2xl font-bold">{stats?.pendingPayments || 0}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
              {activeSection === "users" && (
                <div className="space-y-4">
                  <Card className="backdrop-blur-sm bg-card/80">
                    <CardHeader>
                      <CardTitle>User Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        All registered students and tutors on the platform.
                      </p>
                      {statsLoading ? (
                        <div className="space-y-2">
                          <Skeleton className="h-20 w-full" />
                          <Skeleton className="h-20 w-full" />
                        </div>
                      ) : (
                        <>
                          <div className="mb-4 p-3 border rounded-md bg-muted/20">
                            <p className="font-medium">Total Users: {stats?.totalUsers || 0}</p>
                          </div>
                          <UsersTable />
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
              {activeSection === "settings" && (
                <div className="space-y-4">
                  <Card className="backdrop-blur-sm bg-card/80">
                    <CardHeader>
                      <CardTitle>Platform Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Configure platform settings and preferences.
                      </p>
                      <div className="space-y-3">
                        <div className="p-3 border rounded-md">
                          <p className="font-medium mb-1">Contact Email</p>
                          <p className="text-sm text-muted-foreground">panoramac215@gmail.com</p>
                        </div>
                        <div className="p-3 border rounded-md">
                          <p className="font-medium mb-1">Platform Name</p>
                          <p className="text-sm text-muted-foreground">Panorama Maths Tutors</p>
                        </div>
                        <div className="p-3 border rounded-md">
                          <p className="font-medium mb-1">Phone Number</p>
                          <p className="text-sm text-muted-foreground">+2637 1369 3824</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <UploadModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} />
    </SidebarProvider>
  );
}
