import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import './SavedJobs.css'

function SavedJobs() {
const [savedJobs, setSavedJobs] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
const [removingJobId, setRemovingJobId] = useState(null)

useEffect(() => {
loadSavedJobs()
}, [])

const loadSavedJobs = async () => {
try {
setError('')


  const userId = localStorage.getItem('userId')

  if (!userId) {
    setError('Please log in to view your saved jobs.')
    return
  }

  const seekerResponse = await api.get(
    `/job-seekers/user/${userId}`
  )

  const seekerId = seekerResponse.data.id

  const response = await api.get(
    `/saved-jobs/seeker/${seekerId}`
  )

  setSavedJobs(response.data)
} catch (error) {
  console.error('Error loading saved jobs:', error)
  setError(
    error.response?.data?.message ||
    'Unable to load saved jobs. Please try again.'
  )
} finally {
  setLoading(false)
}


}

const removeSavedJob = async (jobId) => {
try {
setRemovingJobId(jobId)


  const userId = localStorage.getItem('userId')

  if (!userId) {
    setError('Please log in to manage your saved jobs.')
    return
  }

  const seekerResponse = await api.get(
    `/job-seekers/user/${userId}`
  )

  const seekerId = seekerResponse.data.id

  await api.delete(
    `/saved-jobs/seeker/${seekerId}/job/${jobId}`
  )

  setSavedJobs((currentJobs) =>
    currentJobs.filter((job) => job.jobId !== jobId)
  )
} catch (error) {
  console.error('Error removing saved job:', error)
  alert(
    error.response?.data?.message ||
    'Unable to remove this job. Please try again.'
  )
} finally {
  setRemovingJobId(null)
}


}

if (loading) {
return ( <div className="saved-jobs-page"> <div className="saved-jobs-message"> <div className="saved-jobs-loader"></div> <h2>Loading your saved jobs...</h2> <p>Please wait while we retrieve your jobs.</p> </div> </div>
)
}

if (error) {
return ( <div className="saved-jobs-page"> <div className="saved-jobs-message saved-jobs-error"> <h2>Unable to display saved jobs</h2> <p>{error}</p>
<button
className="saved-jobs-primary-button"
onClick={() => {
setLoading(true)
loadSavedJobs()
}}
>
Try Again </button> </div> </div>
)
}

return ( <main className="saved-jobs-page"> <section className="saved-jobs-header"> <div> <p className="saved-jobs-eyebrow">YOUR CAREER JOURNEY</p> <h1>Saved Jobs</h1> <p className="saved-jobs-subtitle">
Keep track of opportunities you want to explore. </p> </div>


    <div className="saved-jobs-count">
      <span>{savedJobs.length}</span>
      <p>{savedJobs.length === 1 ? 'Saved Job' : 'Saved Jobs'}</p>
    </div>
  </section>

  {savedJobs.length === 0 ? (
    <section className="saved-jobs-empty">
      <div className="saved-jobs-empty-icon">☆</div>
      <h2>No saved jobs yet</h2>
      <p>
        When you find a job you like, save it here so you can
        easily return to it later.
      </p>
      <Link
        to="/jobs"
        className="saved-jobs-primary-button"
      >
        Explore Jobs
      </Link>
    </section>
  ) : (
    <section className="saved-jobs-list">
      {savedJobs.map((job) => (
        <article className="saved-job-card" key={job.id}>
          <div className="saved-job-main">
            <div className="saved-job-icon">
              {(job.companyName || 'J')
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="saved-job-details">
              <h2>{job.jobTitle || 'Job title unavailable'}</h2>
              <p className="saved-job-company">
                {job.companyName || 'Company not specified'}
              </p>

              <div className="saved-job-meta">
                <span>📍 {job.location || 'Location not specified'}</span>
                <span>
                  ♡ Saved{' '}
                  {job.savedAt
                    ? new Date(job.savedAt).toLocaleDateString()
                    : 'previously'}
                </span>
              </div>
            </div>
          </div>

          <div className="saved-job-actions">
            <Link
              to={`/jobs/${job.jobId}`}
              className="saved-job-view-button"
            >
              View Details
            </Link>

            <button
              type="button"
              className="saved-job-remove-button"
              onClick={() => removeSavedJob(job.jobId)}
              disabled={removingJobId === job.jobId}
            >
              {removingJobId === job.jobId
                ? 'Removing...'
                : 'Remove'}
            </button>
          </div>
        </article>
      ))}
    </section>
  )}
</main>


)
}

export default SavedJobs
