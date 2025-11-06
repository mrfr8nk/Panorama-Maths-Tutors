import CourseCard from '../CourseCard';
import zimImage from '@assets/generated_images/ZIMSEC_course_thumbnail_mathematics_159fd5b3.png';

export default function CourseCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <CourseCard
        title="ZIMSEC O Level Mathematics"
        description="Complete course covering algebra, geometry, and statistics for ZIMSEC O Level exams."
        type="ZIMSEC"
        status="Free"
        image={zimImage}
        resourceType="PDF"
      />
      <CourseCard
        title="Cambridge A Level Calculus"
        description="Advanced calculus course with detailed video tutorials and practice problems."
        type="Cambridge"
        status="Premium"
        price="$25.00"
        image={zimImage}
        resourceType="Video"
      />
      <CourseCard
        title="Tertiary Mathematics"
        description="University-level mathematics covering linear algebra and differential equations."
        type="Tertiary"
        status="Premium"
        price="$35.00"
        image={zimImage}
        resourceType="Lesson"
      />
    </div>
  );
}
