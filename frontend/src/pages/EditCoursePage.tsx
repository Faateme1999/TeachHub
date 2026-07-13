import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCourse, useUpdateCourse } from '../hooks/useCourses'
import { getApiErrorMessage } from '../lib/apiClient'
import { useToast } from '../components/ui/toast-context'
import { CourseForm } from '../components/CourseForm'
import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { ErrorState } from '../components/ui/States'
import type { CourseInput } from '../types/api'
import '../components/components.css'

// Page for editing an existing course. Loads the current course to pre-fill the
// form, then saves changes. ProtectedRoute (login required).
export function EditCoursePage() {
  const { id } = useParams()
  const courseId = Number(id)
  const navigate = useNavigate()
  const { showToast } = useToast()

  const { data: course, isLoading, isError } = useCourse(courseId)
  const updateCourse = useUpdateCourse(courseId)
  const [serverError, setServerError] = useState('')

  if (isLoading) return <Spinner center />
  if (isError || !course) return <ErrorState message="Could not load this course." />

  function handleSubmit(values: CourseInput) {
    setServerError('')
    updateCourse.mutate(values, {
      onSuccess: () => {
        showToast('Course updated', 'success')
        navigate(`/courses/${courseId}`)
      },
      onError: (err) => setServerError(getApiErrorMessage(err, 'Could not update course')),
    })
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <h1>Edit course</h1>
      <Card>
        <CourseForm
          initialValue={{
            title: course.title,
            description: course.description,
            price: course.price,
          }}
          submitLabel="Save changes"
          submitting={updateCourse.isPending}
          serverError={serverError}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/courses/${courseId}`)}
        />
      </Card>
    </div>
  )
}
