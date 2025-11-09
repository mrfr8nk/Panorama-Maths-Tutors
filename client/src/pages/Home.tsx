import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { CoursesOfferedSection } from "@/components/CoursesOfferedSection";
import { StudyModeSection } from "@/components/StudyModeSection";
import { useAuth } from "@/contexts/AuthContext";


export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection onGetStarted={() => setLocation('/courses')} />
        <CoursesOfferedSection onViewCourses={() => setLocation('/courses')} />
        <StudyModeSection />
      </main>
      <Footer />
    </div>
  );
}