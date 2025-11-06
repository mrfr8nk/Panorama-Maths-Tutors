import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import CoursesOfferedSection from "@/components/CoursesOfferedSection";
import StudyModeSection from "@/components/StudyModeSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CoursesOfferedSection />
        <StudyModeSection />
      </main>
      <Footer />
    </div>
  );
}
