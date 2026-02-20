import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import CoursesOfferedSection from "@/components/CoursesOfferedSection";
import StudyModeSection from "@/components/StudyModeSection";
import FancyUpdatesSection from "@/components/FancyUpdatesSection";
import LatestCoursesSection from "@/components/LatestCoursesSection";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection 
          onViewCourses={() => setLocation('/courses')}
          onGetStarted={() => setLocation('/courses')} 
        />
        <FancyUpdatesSection />
        <LatestCoursesSection />
        <CoursesOfferedSection onViewCourses={() => setLocation('/courses')} />
        <StudyModeSection />
      </main>
      <Footer />
    </div>
  );
}