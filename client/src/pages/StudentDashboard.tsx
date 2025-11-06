import { useState } from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BookOpen, FileText, DollarSign, User, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

const menuItems = [
  { title: "My Courses", icon: BookOpen, id: "courses" },
  { title: "Resources", icon: FileText, id: "resources" },
  { title: "Payments", icon: DollarSign, id: "payments" },
  { title: "Profile", icon: User, id: "profile" },
];

export default function StudentDashboard() {
  const [activeSection, setActiveSection] = useState("courses");
  const [theme, setTheme] = useState<"light" | "dark">("light");

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
                        onClick={() => setActiveSection(item.id)}
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
              <span className="text-sm text-muted-foreground">Welcome back, <span className="font-medium text-foreground">John Doe</span></span>
              <Button variant="ghost" size="icon" onClick={toggleTheme} data-testid="button-theme-toggle">
                {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
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
                  <Card className="backdrop-blur-sm bg-card/80">
                    <CardHeader>
                      <CardTitle>ZIMSEC O Level Algebra</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge>Free</Badge>
                        <Button size="sm" data-testid="button-view-course">View Course</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="backdrop-blur-sm bg-card/80">
                    <CardHeader>
                      <CardTitle>Cambridge A Level Calculus</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">Premium</Badge>
                        <Button size="sm" data-testid="button-view-course">View Course</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {activeSection === "resources" && (
                <div className="text-muted-foreground">Your resources will appear here...</div>
              )}
              
              {activeSection === "payments" && (
                <div className="text-muted-foreground">Payment history coming soon...</div>
              )}
              
              {activeSection === "profile" && (
                <div className="text-muted-foreground">Profile settings coming soon...</div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
