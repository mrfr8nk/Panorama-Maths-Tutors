import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { CoursesOfferedSection } from "@/components/CoursesOfferedSection";
import { StudyModeSection } from "@/components/StudyModeSection";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection onViewCourses={() => setLocation('/courses')} onGetStarted={() => setLocation('/auth')} />
        <CoursesOfferedSection />
        <StudyModeSection />
      </main>
      <Footer />
    </div>
  );
}