import { useState } from "react";
import {
  useCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
} from "../../hooks/useCourses";

import {
  useLessons,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
} from "../../hooks/useLessons";

import { CourseForm } from "../../components/CourseForm";
import { LessonForm } from "../../components/LessonForm";

import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Spinner } from "../../components/ui/Spinner";
import { EmptyState, ErrorState } from "../../components/ui/States";

import { getApiErrorMessage } from "../../lib/apiClient";
import { useToast } from "../../components/ui/toast-context";

import type { Course, CourseInput, Lesson, LessonInput } from "../../types/api";

import "../../components/components.css";

export function AdminCoursesPage() {
  const { showToast } = useToast();

  // -------------------------
  // Courses
  // -------------------------

  const coursesQuery = useCourses();
  const createCourse = useCreateCourse();
  const deleteCourse = useDeleteCourse();

  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseError, setCourseError] = useState("");

  // -------------------------
  // Lessons
  // -------------------------

  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonError, setLessonError] = useState("");
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);

  // Delete course confirmation
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  /*
   * IMPORTANT:
   * These hooks are called at the top level.
   *
   * We give them selectedCourseId ?? 0 because hooks need a number.
   * The requests themselves won't run until a real course is selected.
   */
  const createLesson = useCreateLesson(selectedCourseId ?? 0);
  const updateLesson = useUpdateLesson(selectedCourseId ?? 0);
  const deleteLesson = useDeleteLesson(selectedCourseId ?? 0);

  /*
   * useUpdateCourse also has to be called at the top level.
   *
   * When there is no course being edited, we use 0.
   * We only call mutate() when editingCourse exists.
   */
  const updateCourse = useUpdateCourse(editingCourse?.id ?? 0);

  // -------------------------
  // Course handlers
  // -------------------------

  function openCreateCourse() {
    setEditingCourse(null);
    setCourseError("");
    setShowCourseForm(true);
  }

  function openEditCourse(course: Course) {
    setEditingCourse(course);
    setCourseError("");
    setShowCourseForm(true);
  }

  function handleCourseSubmit(values: CourseInput) {
    setCourseError("");

    if (editingCourse) {
      updateCourse.mutate(values, {
        onSuccess: () => {
          showToast("Course updated", "success");
          setShowCourseForm(false);
          setEditingCourse(null);
        },
        onError: (err) => {
          setCourseError(getApiErrorMessage(err, "Could not update course"));
        },
      });

      return;
    }

    createCourse.mutate(values, {
      onSuccess: () => {
        showToast("Course created", "success");
        setShowCourseForm(false);
      },
      onError: (err) => {
        setCourseError(getApiErrorMessage(err, "Could not create course"));
      },
    });
  }

  function handleDeleteCourse() {
    if (!courseToDelete) return;

    deleteCourse.mutate(courseToDelete.id, {
      onSuccess: () => {
        showToast("Course deleted", "success");
        setCourseToDelete(null);
      },
      onError: (err) => {
        showToast(getApiErrorMessage(err, "Could not delete course"), "error");
        setCourseToDelete(null);
      },
    });
  }

  // -------------------------
  // Lesson handlers
  // -------------------------

  function openAddLesson(courseId: number) {
    setSelectedCourseId(courseId);
    setEditingLesson(null);
    setLessonError("");
    setLessonModalOpen(true);
  }

  function openEditLesson(courseId: number, lesson: Lesson) {
    setSelectedCourseId(courseId);
    setEditingLesson(lesson);
    setLessonError("");
    setLessonModalOpen(true);
  }

  function handleLessonSubmit(values: LessonInput) {
    if (!selectedCourseId) return;

    setLessonError("");

    if (editingLesson) {
      updateLesson.mutate(
        {
          id: editingLesson.id,
          input: values,
        },
        {
          onSuccess: () => {
            showToast("Lesson updated", "success");
            setLessonModalOpen(false);
            setEditingLesson(null);
          },
          onError: (err) => {
            setLessonError(getApiErrorMessage(err, "Could not update lesson"));
          },
        },
      );

      return;
    }

    createLesson.mutate(values, {
      onSuccess: () => {
        showToast("Lesson added", "success");
        setLessonModalOpen(false);
      },
      onError: (err) => {
        setLessonError(getApiErrorMessage(err, "Could not add lesson"));
      },
    });
  }

  function handleDeleteLesson() {
    if (!lessonToDelete) return;

    deleteLesson.mutate(lessonToDelete.id, {
      onSuccess: () => {
        showToast("Lesson deleted", "success");
        setLessonToDelete(null);
      },
      onError: (err) => {
        showToast(getApiErrorMessage(err, "Could not delete lesson"), "error");
        setLessonToDelete(null);
      },
    });
  }

  // -------------------------
  // Loading / error
  // -------------------------

  if (coursesQuery.isLoading) {
    return <Spinner center />;
  }

  if (coursesQuery.isError) {
    return (
      <ErrorState
        message={getApiErrorMessage(
          coursesQuery.error,
          "Could not load courses",
        )}
      />
    );
  }

  const courses = coursesQuery.data ?? [];
  const savingLesson = createLesson.isPending || updateLesson.isPending;

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Manage courses</h1>

          <p className="page-header__subtitle">
            Create, edit, delete courses and manage their lessons.
          </p>
        </div>

        <Button onClick={openCreateCourse}>+ New course</Button>
      </div>

      {/* Create / Edit course form */}
      {showCourseForm && (
        <Card style={{ marginBottom: "var(--space-5)" }}>
          <h2>{editingCourse ? "Edit course" : "Create course"}</h2>

          <CourseForm
            initialValue={
              editingCourse
                ? {
                    title: editingCourse.title,
                    description: editingCourse.description,
                    price: editingCourse.price,
                  }
                : undefined
            }
            submitLabel={editingCourse ? "Save changes" : "Create course"}
            submitting={
              editingCourse ? updateCourse.isPending : createCourse.isPending
            }
            serverError={courseError}
            onSubmit={handleCourseSubmit}
            onCancel={() => {
              setShowCourseForm(false);
              setEditingCourse(null);
            }}
          />
        </Card>
      )}

      {/* No courses */}
      {courses.length === 0 && (
        <EmptyState
          icon="📚"
          title="No courses yet"
          message="Create your first course."
          action={<Button onClick={openCreateCourse}>Create course</Button>}
        />
      )}

      {/* Course list */}
      {courses.length > 0 && (
        <div>
          {courses.map((course) => (
            <CourseAdminCard
              key={course.id}
              course={course}
              onEdit={openEditCourse}
              onDelete={() => setCourseToDelete(course)}
              onAddLesson={openAddLesson}
              onEditLesson={openEditLesson}
              onDeleteLesson={(lesson) => setLessonToDelete(lesson)}
            />
          ))}
        </div>
      )}

      {/* Add/Edit lesson modal */}
      <Modal
        open={lessonModalOpen}
        onClose={() => setLessonModalOpen(false)}
        title={editingLesson ? "Edit lesson" : "Add lesson"}
      >
        <LessonForm
          initialValue={
            editingLesson
              ? {
                  title: editingLesson.title,
                  content: editingLesson.content,
                }
              : undefined
          }
          submitLabel={editingLesson ? "Save changes" : "Add lesson"}
          submitting={savingLesson}
          serverError={lessonError}
          onSubmit={handleLessonSubmit}
          onCancel={() => setLessonModalOpen(false)}
        />
      </Modal>

      {/* Delete course confirmation */}
      <ConfirmDialog
        open={courseToDelete !== null}
        title="Delete course?"
        message={`Delete "${courseToDelete?.title}"? This cannot be undone.`}
        loading={deleteCourse.isPending}
        onConfirm={handleDeleteCourse}
        onCancel={() => setCourseToDelete(null)}
      />

      {/* Delete lesson confirmation */}
      <ConfirmDialog
        open={lessonToDelete !== null}
        title="Delete lesson?"
        message={`Remove "${lessonToDelete?.title}"?`}
        loading={deleteLesson.isPending}
        onConfirm={handleDeleteLesson}
        onCancel={() => setLessonToDelete(null)}
      />
    </div>
  );
}

/*
 * Separate component for each course.
 *
 * This is useful because each course needs its OWN useLessons(course.id).
 */
function CourseAdminCard({
  course,
  onEdit,
  onDelete,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
}: {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: () => void;
  onAddLesson: (courseId: number) => void;
  onEditLesson: (courseId: number, lesson: Lesson) => void;
  onDeleteLesson: (lesson: Lesson) => void;
}) {
  const lessonsQuery = useLessons(course.id);

  const lessons = lessonsQuery.data ?? [];

  return (
    <Card style={{ marginBottom: "var(--space-4)" }}>
      {/* Course information */}
      <div className="page-header">
        <div>
          <h2 className="page-header__title">{course.title}</h2>

          <p>{course.description}</p>
        </div>

        <Badge>${course.price}</Badge>
      </div>

      {/* Course actions */}
      <div className="detail__actions" style={{ marginTop: "var(--space-3)" }}>
        <Button variant="secondary" onClick={() => onEdit(course)}>
          Edit
        </Button>

        <Button variant="danger" onClick={onDelete}>
          Delete
        </Button>

        <Button onClick={() => onAddLesson(course.id)}>+ Add lesson</Button>
      </div>

      {/* Lessons */}
      <section style={{ marginTop: "var(--space-4)" }}>
        <h3>Lessons</h3>

        {lessonsQuery.isLoading && <Spinner center />}

        {lessonsQuery.isError && (
          <ErrorState message="Could not load lessons." />
        )}

        {!lessonsQuery.isLoading && lessons.length === 0 && (
          <p>No lessons yet.</p>
        )}

        {lessons.map((lesson, index) => (
          <div key={lesson.id} className="lesson-item">
            <div className="lesson-item__body">
              <p className="lesson-item__title">
                {index + 1}. {lesson.title}
              </p>

              <p className="lesson-item__content">{lesson.content}</p>
            </div>

            <div className="lesson-item__actions">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditLesson(course.id, lesson)}
              >
                Edit
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteLesson(lesson)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </section>
    </Card>
  );
}

// Admin course management. Reached at /admin/courses.

//

// TODO(junior) — US-037 (manage courses): build the real UI here. Everything you

// need already exists in the codebase:

//   - List courses:            useCourses()               (hooks/useCourses.ts)

//   - Create a course:          useCreateCourse()          + <CourseForm />

//   - Edit a course:            useUpdateCourse(id)         + <CourseForm />

//   - Delete a course:          useDeleteCourse()          + <ConfirmDialog />

//   - Manage a course's lessons: useLessons / useCreateLesson / useUpdateLesson /

//                                useDeleteLesson (hooks/useLessons.ts) + <LessonForm />

// Suggested layout: a table/grid of courses with Edit/Delete actions and a

// "+ New course" button. You can lift the pieces from the existing

// CoursesPage / CourseDetailPage / CreateCoursePage / EditCoursePage.

//

// Because this whole page sits behind <AdminRoute> and the backend routes are

// guarded by @Roles(ADMIN), you don't need per-button role checks here.
