import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Upload } from "lucide-react";
import heroImage from "@assets/generated_images/Hero_background_mathematics_classroom_ddfc0604.png";
import { useState } from "react";
import UploadModal from "./UploadModal";

interface HeroSectionProps {
  onViewCourses?: () => void;
  onGetStarted?: () => void;
}

export function HeroSection({ onViewCourses, onGetStarted }: HeroSectionProps) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-8 md:p-12 shadow-2xl">
            <h1 className="font-heading font-bold text-4xl md:text-6xl text-white mb-4">
              Master Maths with Confidence
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Professional tutoring for ZIMSEC, Cambridge, and Tertiary Mathematics.
              Excel in your studies with expert guidance.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="px-8" onClick={onViewCourses}>
                View Courses
              </Button>
              <Button size="lg" variant="outline" className="px-8 backdrop-blur-sm" onClick={onGetStarted}>
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="secondary" 
                className="px-8 backdrop-blur-sm"
                onClick={() => setUploadModalOpen(true)}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Content
              </Button>
            </div>
          </div>
        </div>
      </div>
      <UploadModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} />
    </section>
  );
}
