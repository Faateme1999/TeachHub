export function CourseCardSkeleton() {
  return (
    <div className="course-card card course-card-skeleton">
      <div className="course-card-skeleton__top">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-badge" />
      </div>

      <div className="skeleton skeleton-description" />
      <div className="skeleton skeleton-description skeleton-description--short" />

      <div className="skeleton skeleton-meta" />
    </div>
  );
}
