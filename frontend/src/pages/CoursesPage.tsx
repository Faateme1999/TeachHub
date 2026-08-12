import { Link } from "react-router-dom";
import { useState } from "react";
import { useCourses } from "../hooks/useCourses";
import { useAuth } from "../context/auth-context";
import { getApiErrorMessage } from "../lib/apiClient";
import { CourseCard } from "../components/CourseCard";
import { Button } from "../components/ui/Button";
import { EmptyState, ErrorState } from "../components/ui/States";
import { Input } from "../components/ui/Input";
import { CourseCardSkeleton } from "../components/ui/CourseCardSkeleton";
import "../components/components.css";

// The main landing page: a welcome hero + a grid of every course.
// Admins also get a "New course" button.
export function CoursesPage() {
  const { isAdmin } = useAuth();

  // Search text
  const [search, setSearch] = useState("");

  // Current pagination page
  const [page, setPage] = useState(1);

  // Get the current page of courses from the backend
  const { data: coursesData, isLoading, isError, error } = useCourses(page);

  // Backend returns:
  // {
  //   courses: [...],
  //   page: 1,
  //   totalPages: 3,
  //   total: 15
  // }
  //
  // We only need the courses array for displaying the cards.
  const courses = coursesData?.courses ?? [];

  // Filter the courses of the CURRENT PAGE by title.
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      {/* -------------------------------------------------- */}
      {/* Hero */}
      {/* -------------------------------------------------- */}

      <section className="hero">
        <h1>Learn something new on TeachHub</h1>

        <p>
          Browse community-made courses, follow along with the lessons, and
          enroll in the ones you like.
        </p>
      </section>

      {/* -------------------------------------------------- */}
      {/* Page header */}
      {/* -------------------------------------------------- */}

      <div className="page-header">
        <div>
          <h2 className="page-header__title">All courses</h2>

          <p className="page-header__subtitle">
            {coursesData
              ? `${coursesData.total} available`
              : "Discover what to learn next"}
          </p>
        </div>

        {isAdmin && (
          <Link to="/courses/new">
            <Button>+ New course</Button>
          </Link>
        )}
      </div>

      {/* -------------------------------------------------- */}
      {/* Search */}
      {/* -------------------------------------------------- */}

      <div style={{ marginBottom: "var(--space-4)" }}>
        <Input
          label="Search courses"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* -------------------------------------------------- */}
      {/* Loading skeleton */}
      {/* -------------------------------------------------- */}

      {isLoading && (
        <div className="course-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* Error */}
      {/* -------------------------------------------------- */}

      {isError && (
        <ErrorState
          message={getApiErrorMessage(error, "Could not load courses")}
        />
      )}

      {/* -------------------------------------------------- */}
      {/* No courses at all */}
      {/* -------------------------------------------------- */}

      {!isLoading && courses.length === 0 && (
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

      {/* -------------------------------------------------- */}
      {/* Course cards */}
      {/* -------------------------------------------------- */}

      {filteredCourses.length > 0 && (
        <div className="course-grid">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* Search returned no results */}
      {/* -------------------------------------------------- */}

      {!isLoading && courses.length > 0 && filteredCourses.length === 0 && (
        <EmptyState
          icon="🔍"
          title="No courses found"
          message={`No courses match "${search}".`}
        />
      )}

      {/* -------------------------------------------------- */}
      {/* Pagination */}
      {/* -------------------------------------------------- */}

      {coursesData && coursesData.totalPages > 1 && (
        <div className="pagination">
          {/* Previous */}

          <Button
            variant="secondary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ← Previous
          </Button>

          {/* Page numbers */}

          {Array.from({ length: coursesData.totalPages }, (_, index) => {
            const pageNumber = index + 1;

            return (
              <Button
                key={pageNumber}
                variant={pageNumber === page ? "primary" : "secondary"}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            );
          })}

          {/* Next */}

          <Button
            variant="secondary"
            disabled={page === coursesData.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}
