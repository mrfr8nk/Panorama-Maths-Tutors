import { useState } from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutDashboard, Upload, BookOpen, DollarSign, Users, Settings, Moon, Sun } from "lucide-react";
import DashboardStats from "@/components/DashboardStats";
import UploadModal from "@/components/UploadModal";
import CourseTable from "@/components/CourseTable";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

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
                <div className="text-muted-foreground">Payment management coming soon...</div>
              )}
              {activeSection === "users" && (
                <div className="text-muted-foreground">User management coming soon...</div>
              )}
              {activeSection === "settings" && (
                <div className="text-muted-foreground">Settings coming soon...</div>
              )}
            </div>
          </main>
        </div>
      </div>

      <UploadModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} />
    </SidebarProvider>
  );
}
