import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCourse, useDeleteCourse, useEnroll } from '../hooks/useCourses'
import {
  useLessons,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
} from '../hooks/useLessons'
import { useAuth } from '../context/auth-context'
import { getApiErrorMessage } from '../lib/apiClient'
import { formatDate, formatPrice } from '../lib/format'
import { useToast } from '../components/ui/toast-context'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState, ErrorState } from '../components/ui/States'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { LessonForm } from '../components/LessonForm'
import type { Lesson, LessonInput } from '../types/api'
import '../components/components.css'

// The course detail page. It shows:
//  - the course info + Enroll button (for any logged-in user / student)
//  - edit / delete course actions (ADMINS only)
//  - the list of lessons, with add / edit / delete (ADMINS only)
//
// Course/lesson management is now admin-only, both here (UI hidden for
// non-admins) and on the backend (routes guarded by @Roles(ADMIN)). Enrolling
// stays open to any logged-in user.
export function CourseDetailPage() {
  const { id } = useParams()
  const courseId = Number(id)
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin } = useAuth()
  const { showToast } = useToast()

  // Two separate queries: the course, and its lessons (backend doesn't nest them).
  const courseQuery = useCourse(courseId)
  const lessonsQuery = useLessons(courseId)

  const enroll = useEnroll()
  const deleteCourse = useDeleteCourse()
  const createLesson = useCreateLesson(courseId)
  const updateLesson = useUpdateLesson(courseId)
  const deleteLesson = useDeleteLesson(courseId)

  // Local UI state for the modals/dialogs on this page.
  const [lessonModalOpen, setLessonModalOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [lessonError, setLessonError] = useState('')
  const [confirmDeleteCourse, setConfirmDeleteCourse] = useState(false)
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null)

  if (courseQuery.isLoading) return <Spinner center />
  if (courseQuery.isError || !courseQuery.data) {
    return (
      <ErrorState
        title="Course not found"
        message="This course may have been deleted."
        action={
          <Link to="/courses">
            <Button variant="secondary">Back to courses</Button>
          </Link>
        }
      />
    )
  }

  const course = courseQuery.data

  // --- Handlers ---
  function handleEnroll() {
    enroll.mutate(courseId, {
      onSuccess: () => showToast('You are enrolled! 🎉', 'success'),
      // The backend returns 400 "already enrolled" — show it as a friendly toast.
      onError: (err) => showToast(getApiErrorMessage(err, 'Could not enroll'), 'error'),
    })
  }

  function handleDeleteCourse() {
    deleteCourse.mutate(courseId, {
      onSuccess: () => {
        showToast('Course deleted', 'success')
        navigate('/courses')
      },
      onError: (err) => {
        // Deleting a course with lessons/enrollments currently fails on the
        // backend (cascade delete is a junior TODO) — explain that.
        showToast(
          getApiErrorMessage(err, 'Could not delete. It may still have lessons or enrollments.'),
          'error',
        )
        setConfirmDeleteCourse(false)
      },
    })
  }

  function openAddLesson() {
    setEditingLesson(null)
    setLessonError('')
    setLessonModalOpen(true)
  }

  function openEditLesson(lesson: Lesson) {
    setEditingLesson(lesson)
    setLessonError('')
    setLessonModalOpen(true)
  }

  function handleLessonSubmit(values: LessonInput) {
    setLessonError('')
    const onError = (err: unknown) =>
      setLessonError(getApiErrorMessage(err, 'Could not save lesson'))

    if (editingLesson) {
      updateLesson.mutate(
        { id: editingLesson.id, input: values },
        {
          onSuccess: () => {
            showToast('Lesson updated', 'success')
            setLessonModalOpen(false)
          },
          onError,
        },
      )
    } else {
      createLesson.mutate(values, {
        onSuccess: () => {
          showToast('Lesson added', 'success')
          setLessonModalOpen(false)
        },
        onError,
      })
    }
  }

  function handleDeleteLesson() {
    if (!lessonToDelete) return
    deleteLesson.mutate(lessonToDelete.id, {
      onSuccess: () => {
        showToast('Lesson deleted', 'success')
        setLessonToDelete(null)
      },
      onError: (err) => {
        showToast(getApiErrorMessage(err, 'Could not delete lesson'), 'error')
        setLessonToDelete(null)
      },
    })
  }

  const lessons = lessonsQuery.data ?? []
  const savingLesson = createLesson.isPending || updateLesson.isPending

  return (
    <div>
      <Link to="/courses" className="navbar__link" style={{ paddingLeft: 0 }}>
        ← All courses
      </Link>

      {/* --- Course header card --- */}
      <Card style={{ marginTop: 'var(--space-3)' }}>
        <div className="page-header" style={{ marginBottom: 'var(--space-3)' }}>
          <div>
            <h1 className="page-header__title">{course.title}</h1>
            <p className="page-header__subtitle">
              Created {formatDate(course.createdAt)}
            </p>
          </div>
          <Badge>{formatPrice(course.price)}</Badge>
        </div>
        <p>{course.description}</p>

        <div className="detail__actions" style={{ marginTop: 'var(--space-4)' }}>
          {isAuthenticated && (
            <Button onClick={handleEnroll} disabled={enroll.isPending}>
              {enroll.isPending ? 'Enrolling…' : 'Enroll in this course'}
            </Button>
          )}
          {isAdmin && (
            <>
              <Link to={`/courses/${courseId}/edit`}>
                <Button variant="secondary">Edit</Button>
              </Link>
              <Button variant="danger" onClick={() => setConfirmDeleteCourse(true)}>
                Delete
              </Button>
            </>
          )}
          {!isAuthenticated && (
            <Link to="/login">
              <Button variant="secondary">Log in to enroll</Button>
            </Link>
          )}
        </div>
      </Card>

      {/* --- Lessons section --- */}
      <section className="detail__section">
        <div className="page-header">
          <h2 className="page-header__title">Lessons</h2>
          {isAdmin && <Button onClick={openAddLesson}>+ Add lesson</Button>}
        </div>

        {lessonsQuery.isLoading && <Spinner center />}
        {lessonsQuery.isError && <ErrorState message="Could not load lessons." />}

        {lessonsQuery.data && lessons.length === 0 && (
          <EmptyState
            icon="📝"
            title="No lessons yet"
            message={isAdmin ? 'Add the first lesson to this course.' : 'Check back later.'}
          />
        )}

        {lessons.length > 0 && (
          <div className="lesson-list">
            {lessons.map((lesson, index) => (
              <Card key={lesson.id} className="lesson-item">
                <div className="lesson-item__body">
                  <p className="lesson-item__title">
                    {index + 1}. {lesson.title}
                  </p>
                  <p className="lesson-item__content">{lesson.content}</p>
                </div>
                {isAdmin && (
                  <div className="lesson-item__actions">
                    <Button variant="ghost" size="sm" onClick={() => openEditLesson(lesson)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setLessonToDelete(lesson)}>
                      Delete
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* --- Add/Edit lesson modal --- */}
      <Modal
        open={lessonModalOpen}
        onClose={() => setLessonModalOpen(false)}
        title={editingLesson ? 'Edit lesson' : 'Add lesson'}
      >
        <LessonForm
          initialValue={
            editingLesson
              ? { title: editingLesson.title, content: editingLesson.content }
              : undefined
          }
          submitLabel={editingLesson ? 'Save changes' : 'Add lesson'}
          submitting={savingLesson}
          serverError={lessonError}
          onSubmit={handleLessonSubmit}
          onCancel={() => setLessonModalOpen(false)}
        />
      </Modal>

      {/* --- Confirm: delete course --- */}
      <ConfirmDialog
        open={confirmDeleteCourse}
        title="Delete course?"
        message="This permanently removes the course. This cannot be undone."
        loading={deleteCourse.isPending}
        onConfirm={handleDeleteCourse}
        onCancel={() => setConfirmDeleteCourse(false)}
      />

      {/* --- Confirm: delete lesson --- */}
      <ConfirmDialog
        open={lessonToDelete !== null}
        title="Delete lesson?"
        message={`Remove "${lessonToDelete?.title}" from this course?`}
        loading={deleteLesson.isPending}
        onConfirm={handleDeleteLesson}
        onCancel={() => setLessonToDelete(null)}
      />
    </div>
  )
}
