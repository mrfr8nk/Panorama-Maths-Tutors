import { Course } from "@/lib/api";
import ContentGallery from "./ContentGallery";

interface SuggestedContentProps {
  allCourses: Course[];
  currentCourse?: Course;
  userEnrolledCourses: string[];
  onEnroll: (courseId: string) => void;
  onDownload?: (course: Course) => void;
  maxSuggestions?: number;
}

export default function SuggestedContent({
  allCourses,
  currentCourse,
  userEnrolledCourses,
  onEnroll,
  onDownload,
  maxSuggestions = 3
}: SuggestedContentProps) {
  const getSuggestedCourses = (): Course[] => {
    // Filter out enrolled courses and current course
    let available = allCourses.filter(
      course => 
        !userEnrolledCourses.includes(course._id) && 
        course._id !== currentCourse?._id
    );

    if (available.length === 0) return [];

    // If we have a current course, prioritize same type and resource type
    if (currentCourse) {
      const sameType = available.filter(c => c.type === currentCourse.type);
      const sameResource = available.filter(c => c.resourceType === currentCourse.resourceType);
      
      // Combine and dedupe
      const combined = [...sameType, ...sameResource];
      const prioritized = Array.from(new Set(combined.map(c => c._id))).map(id => 
        combined.find(c => c._id === id)!
      );
      
      if (prioritized.length >= maxSuggestions) {
        return prioritized.slice(0, maxSuggestions);
      }
      
      // Fill remaining with popular courses (by enrollments)
      const remaining = available
        .filter(c => !prioritized.includes(c))
        .sort((a, b) => (b.enrollments || 0) - (a.enrollments || 0));
      
      return [...prioritized, ...remaining].slice(0, maxSuggestions);
    }

    // No current course, just return by popularity and mix
    return available
      .sort((a, b) => (b.enrollments || 0) - (a.enrollments || 0))
      .slice(0, maxSuggestions);
  };

  const suggested = getSuggestedCourses();

  if (suggested.length === 0) return null;

  return (
    <ContentGallery
      courses={suggested}
      onEnroll={onEnroll}
      onDownload={onDownload}
      title="You May Also Like"
      userEnrolledCourses={userEnrolledCourses}
    />
  );
}
