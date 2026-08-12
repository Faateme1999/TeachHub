import { Link } from "react-router-dom";
import { Badge } from "./ui/Badge";
import { formatPrice } from "../lib/format";
import type { Course } from "../types/api";
import "./components.css";

// One course shown in the courses grid. The whole card is a link to the
// course's detail page.
export function CourseCard({ course }: { course: Course }) {
  return (
    <Link to={`/courses/${course.id}`} className="course-card card">
      <div className="course-card__top">
        <h3 className="course-card__title">{course.title}</h3>
        <Badge>{formatPrice(course.price)}</Badge>
      </div>
      <p className="course-card__desc">{course.description}</p>
      <div className="course-card__meta">
        {course.lessons?.length ?? 0} lessons
      </div>
      <div className="course-card__meta">View course →</div>
    </Link>
  );
}
