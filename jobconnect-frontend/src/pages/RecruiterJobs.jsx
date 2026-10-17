import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function RecruiterJobs() {

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {

    try {

      const userId = localStorage.getItem('userId')

      if (!userId) {
        setError('Please login first')
        setLoading(false)
        return
      }

      // Get recruiter profile using logged-in user ID
      const recruiterResponse = await api.get(
        `/recruiters/user/${userId}`
      )

      const recruiterId = recruiterResponse.data.id

      // Get jobs posted by this recruiter
      const response = await api.get(
        `/jobs/recruiter/${recruiterId}`
      )

      setJobs(response.data)

    } catch (error) {

      console.error('FULL ERROR:', error)
      console.error('STATUS:', error.response?.status)
      console.error('DATA:', error.response?.data)
      console.error('URL:', error.config?.url)

      setError(
        `Failed to load jobs. Status: ${
          error.response?.status || 'Unknown'
        }`
      )

    } finally {

      setLoading(false)

    }
  }

  // =========================
  // DELETE JOB
  // =========================

  const handleDelete = async (jobId) => {

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this job?'
    )

    if (!confirmDelete) {
      return
    }

    try {

      await api.delete(`/jobs/${jobId}`)

      alert('Job deleted successfully!')

      // Remove deleted job from screen
      setJobs(
        jobs.filter((job) => job.id !== jobId)
      )

    } catch (error) {

      console.error('Delete job error:', error)

      alert(
        error.response?.data?.message ||
        'Failed to delete job'
      )

    }
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return <h2>Loading jobs...</h2>
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return <h2>{error}</h2>
  }

  // =========================
  // PAGE
  // =========================

  return (
    <div style={{ padding: '30px' }}>

      <h1>My Jobs</h1>

      {jobs.length === 0 ? (

        <p>You have not posted any jobs yet.</p>

      ) : (

        jobs.map((job) => (

          <div
            key={job.id}
            style={{
              border: '1px solid #ddd',
              padding: '20px',
              marginBottom: '20px',
              borderRadius: '8px'
            }}
          >

            <h2>{job.title}</h2>

            <p>
              <strong>Location:</strong> {job.location}
            </p>

            <p>
              <strong>Salary:</strong>{' '}
              ₹{job.salaryMin} - ₹{job.salaryMax}
            </p>

            <p>
              <strong>Job Type:</strong> {job.jobType}
            </p>

            <p>
              <strong>Work Mode:</strong> {job.workMode}
            </p>

            <p>
              <strong>Vacancies:</strong> {job.vacancies}
            </p>

            <p>
              <strong>Status:</strong> {job.status}
            </p>

            <br />

            <Link to={`/recruiter/applications/${job.id}`}>
              <button>
                View Applications
              </button>
            </Link>

            {' '}

            <button
              onClick={() =>
                navigate(`/recruiter/edit-job/${job.id}`)
              }
            >
              Edit
            </button>

            {' '}

            <button
              onClick={() =>
                handleDelete(job.id)
              }
            >
              Delete
            </button>

          </div>

        ))

      )}

    </div>
  )
}

export default RecruiterJobs