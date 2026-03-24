export const dynamicParams = false;

import { getCourseBySlug, courses } from "@/lib/courses-data";
import CourseDetailView from "./CourseDetailView";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface CourseDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return courses.map((course) => ({
    slug: course.slug,
  }));
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            Course Not Found
          </h1>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  // Get related courses (same category, different course)
  const relatedCourses = courses
    .filter(c => c.category === course.category && c.id !== course.id)
    .slice(0, 3);

  return <CourseDetailView course={course} relatedCourses={relatedCourses} />;
}
