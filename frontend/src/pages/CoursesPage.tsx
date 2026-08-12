import { Link } from "react-router-dom";
import { useCourses } from "../hooks/useCourses";
import { useAuth } from "../context/auth-context";
import { getApiErrorMessage } from "../lib/apiClient";
import { CourseCard } from "../components/CourseCard";
import { Button } from "../components/ui/Button";
import { EmptyState, ErrorState } from "../components/ui/States";
import { useState } from "react";
import { Input } from "../components/ui/Input";
import "../components/components.css";
import { CourseCardSkeleton } from "../components/ui/CourseCardSkeleton";

// The main landing page: a welcome hero + a grid of every course.
// Admins also get a "New course" button (students only browse + enroll).
export function CoursesPage() {
  const { isAdmin } = useAuth();
  const { data: courses, isLoading, isError, error } = useCourses();
  const [search, setSearch] = useState("");

  const filteredCourses =
    courses?.filter((course) =>
      course.title.toLowerCase().includes(search.toLowerCase()),
    ) ?? [];

  return (
    <div>
      <section className="hero">
        <h1>Learn something new on TeachHub</h1>
        <p>
          Browse community-made courses, follow along with the lessons, and
          enroll in the ones you like.
        </p>
      </section>

      <div className="page-header">
        <div>
          <h2 className="page-header__title">All courses</h2>
          <p className="page-header__subtitle">
            {courses
              ? `${courses.length} available`
              : "Discover what to learn next"}
          </p>
        </div>
        {isAdmin && (
          <Link to="/courses/new">
            <Button>+ New course</Button>
          </Link>
        )}
      </div>
      <div style={{ marginBottom: "var(--space-4)" }}>
        <Input
          label="Search courses"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading && (
        <div className="course-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
        </div>
      )}

      {isError && (
        <ErrorState
          message={getApiErrorMessage(error, "Could not load courses")}
        />
      )}

      {courses && courses.length === 0 && (
        <EmptyState
          icon="📚"
          title="No courses yet"
          message={
            isAdmin
              ? "Create the first course to get things started."
              : "Check back soon — an admin will add courses."
          }
          action={
            isAdmin ? (
              <Link to="/courses/new">
                <Button>Create a course</Button>
              </Link>
            ) : undefined
          }
        />
      )}

      {filteredCourses.length > 0 && (
        <div className="course-grid">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
      {courses && courses.length > 0 && filteredCourses.length === 0 && (
        <EmptyState
          icon="🔍"
          title="No courses found"
          message={`No courses match "${search}".`}
        />
      )}
    </div>
  );
}
