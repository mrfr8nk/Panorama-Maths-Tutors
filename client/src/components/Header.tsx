import { Link } from "wouter";
import { BookOpen, Menu, Moon, Sun, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

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

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover-elevate px-3 py-2 rounded-md" data-testid="link-home">
              <BookOpen className="w-8 h-8 text-primary" />
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg text-foreground">panoramac</span>
                <span className="font-heading text-xs text-muted-foreground -mt-1">Maths Tutors</span>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/">
              <Button variant="ghost" size="default" data-testid="link-nav-home">Home</Button>
            </Link>
            <Link href="/courses">
              <Button variant="ghost" size="default" data-testid="link-nav-courses">Courses</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" size="default" data-testid="link-nav-about">About</Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" size="default" data-testid="link-nav-contact">Contact</Button>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            {user ? (
              <>
                <Link href={user.role === 'admin' ? "/admin" : "/student"}>
                  <Button variant="ghost" size="default" className="gap-2" data-testid="button-dashboard">
                    <User className="w-4 h-4" />
                    {user.name}
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={logout} data-testid="button-logout">
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button variant="default" size="default" data-testid="button-login">
                  Login
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-2 pb-4">
            <Link href="/">
              <Button variant="ghost" size="default" className="w-full justify-start" data-testid="link-mobile-home">Home</Button>
            </Link>
            <Link href="/courses">
              <Button variant="ghost" size="default" className="w-full justify-start" data-testid="link-mobile-courses">Courses</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" size="default" className="w-full justify-start" data-testid="link-mobile-about">About</Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" size="default" className="w-full justify-start" data-testid="link-mobile-contact">Contact</Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
