import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateCourse } from '../hooks/useCourses'
import { getApiErrorMessage } from '../lib/apiClient'
import { useToast } from '../components/ui/toast-context'
import { CourseForm } from '../components/CourseForm'
import { Card } from '../components/ui/Card'
import type { CourseInput } from '../types/api'
import '../components/components.css'

// Page for creating a new course. It's a ProtectedRoute (login required).
export function CreateCoursePage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const createCourse = useCreateCourse()
  const [serverError, setServerError] = useState('')

  function handleSubmit(values: CourseInput) {
    setServerError('')
    createCourse.mutate(values, {
      onSuccess: (course) => {
        showToast('Course created', 'success')
        navigate(`/courses/${course.id}`)
      },
      onError: (err) => setServerError(getApiErrorMessage(err, 'Could not create course')),
    })
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <h1>Create a course</h1>
      <Card>
        <CourseForm
          submitLabel="Create course"
          submitting={createCourse.isPending}
          serverError={serverError}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/courses')}
        />
      </Card>
    </div>
  )
}
