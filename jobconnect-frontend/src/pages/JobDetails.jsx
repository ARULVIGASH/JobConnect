import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'

function JobDetails() {

const { id } = useParams()

const [job, setJob] = useState(null)
const [seekerId, setSeekerId] = useState(null)

const [isSaved, setIsSaved] = useState(false)
const [isApplied, setIsApplied] = useState(false)

const [resumes, setResumes] = useState([])
const [selectedResume, setSelectedResume] = useState('')
const [coverLetter, setCoverLetter] = useState('')

const [showApplyForm, setShowApplyForm] = useState(false)

const [loading, setLoading] = useState(true)
const [applying, setApplying] = useState(false)

const [message, setMessage] = useState('')
const [error, setError] = useState('')

useEffect(() => {
loadJob()
}, [id])

useEffect(() => {
loadSeeker()
}, [id])

const loadJob = async () => {

try {

  setLoading(true)
  setError('')

  const response = await api.get('/jobs/' + id)

  console.log('Job:', response.data)

  setJob(response.data)

} catch (err) {

  console.error('Job error:', err)

  setError(
    err.response?.data?.message ||
    'Failed to load job'
  )

} finally {

  setLoading(false)

}

}

const loadSeeker = async () => {

const userId = localStorage.getItem('userId')
const role = localStorage.getItem('role')

if (!userId || role !== 'JOB_SEEKER') {
  return
}

try {

  const response = await api.get(
    '/job-seekers/user/' + userId
  )

  const seekerIdValue = response.data.id

  console.log('Job Seeker ID:', seekerIdValue)

  setSeekerId(seekerIdValue)

  loadSavedStatus(seekerIdValue)
  loadApplicationStatus(seekerIdValue)

} catch (err) {

  console.error('Seeker loading error:', err)

  setError(
    err.response?.data?.message ||
    'Unable to load your job seeker profile'
  )

}

}

const loadSavedStatus = async (seekerIdValue) => {

try {

  const response = await api.get(
    '/saved-jobs/seeker/' + seekerIdValue
  )

  console.log('Saved Jobs:', response.data)

  const alreadySaved = response.data.some(
    (savedJob) =>
      Number(savedJob.jobId) === Number(id)
  )

  setIsSaved(alreadySaved)

} catch (err) {

  console.error('Saved jobs loading error:', err)

  setIsSaved(false)

}

}

const loadApplicationStatus = async (seekerIdValue) => {

try {

  const response = await api.get(
    '/applications/seeker/' + seekerIdValue
  )

  console.log('Applications:', response.data)

  const alreadyApplied = response.data.some(
    (application) =>
      Number(application.jobId) === Number(id)
  )

  setIsApplied(alreadyApplied)

} catch (err) {

  console.error('Application loading error:', err)

  setIsApplied(false)

}

}

const saveJob = async () => {

try {

  setMessage('')
  setError('')

  if (!seekerId) {
    setError('Please login as a job seeker')
    return
  }

  if (isSaved) {
    setMessage('⭐ This job is already saved')
    return
  }

  await api.post(
    '/saved-jobs?jobSeekerId=' +
    seekerId +
    '&jobId=' +
    id
  )

  setIsSaved(true)

  setMessage('⭐ Job saved successfully!')

} catch (err) {

  console.error('Save job error:', err)

  if (err.response?.status === 400) {

    setIsSaved(true)

    setMessage('⭐ This job is already saved')

  } else if (err.response?.status === 403) {

    setError(
      'You are not authorized to save jobs. Please login again as a Job Seeker.'
    )

  } else {

    setError(
      err.response?.data?.message ||
      'Failed to save job'
    )

  }
}

}

const openApplyForm = async () => {

setMessage('')
setError('')

if (!seekerId) {

  setError('Please login as a job seeker')

  return
}

if (isApplied) {

  setMessage(
    '✅ You have already applied for this job.'
  )

  return
}

try {

  const response = await api.get(
    '/resumes/seeker/' + seekerId
  )

  console.log('Resumes:', response.data)

  setResumes(response.data)

  setShowApplyForm(true)

} catch (err) {

  console.error('Resume loading error:', err)

  if (err.response?.status === 403) {

    setError(
      'You are not authorized to access your resumes. Please login again.'
    )

  } else {

    setError(
      err.response?.data?.message ||
      'Unable to load your resumes'
    )

  }
}

}

const applyJob = async (e) => {

e.preventDefault()

setMessage('')
setError('')

if (!selectedResume) {

  setError(
    'Please select a resume before applying.'
  )

  return
}

if (!coverLetter.trim()) {

  setError(
    'Please enter a cover letter.'
  )

  return
}

try {

  setApplying(true)

  const data = {
    jobId: Number(id),
    seekerId: Number(seekerId),
    resumeId: Number(selectedResume),
    coverLetter: coverLetter.trim()
  }

  console.log('Applying:', data)

  await api.post(
    '/applications',
    data
  )

  setIsApplied(true)
  setShowApplyForm(false)
  setSelectedResume('')
  setCoverLetter('')

  setMessage(
    '✅ Application submitted successfully!'
  )

} catch (err) {

  console.error('Apply error:', err)

  if (err.response?.status === 403) {

    setError(
      'You are not authorized to apply. Please login again as a Job Seeker.'
    )

  } else if (err.response?.status === 400) {

    setError(
      err.response?.data?.message ||
      'You may have already applied for this job.'
    )

  } else {

    setError(
      err.response?.data?.message ||
      'Failed to apply for this job'
    )

  }

} finally {

  setApplying(false)

}

}

if (loading) {

return (
  <div style={styles.page}>
    <h2>Loading job...</h2>
  </div>
)

}

if (!job) {

return (
  <div style={styles.page}>
    <h2>Job not found</h2>
  </div>
)

}

return (

<div style={styles.page}>

  <div style={styles.jobCard}>

    <h1 style={styles.title}>
      {job.title}
    </h1>

    <p>
      <strong>Company:</strong>{' '}
      {job.companyName || 'N/A'}
    </p>

    <p>
      <strong>Location:</strong>{' '}
      {job.location}
    </p>

    <p>
      <strong>Salary:</strong>{' '}
      ₹{job.salaryMin} - ₹{job.salaryMax}
    </p>

    <p>
      <strong>Job Type:</strong>{' '}
      {job.jobType}
    </p>

    <p>
      <strong>Work Mode:</strong>{' '}
      {job.workMode}
    </p>

    <p>
      <strong>Vacancies:</strong>{' '}
      {job.vacancies}
    </p>

    <p>
      <strong>Experience:</strong>{' '}
      {job.experience} years
    </p>

    <p>
      <strong>Skills:</strong>{' '}
      {job.skills}
    </p>

    <h3>
      Description
    </h3>

    <p style={styles.description}>
      {job.description}
    </p>

    {message && (

      <div style={styles.success}>
        {message}
      </div>

    )}

    {error && (

      <div style={styles.error}>
        {error}
      </div>

    )}

    {seekerId && (

      <div style={styles.buttonContainer}>

        <button
          onClick={saveJob}
          disabled={isSaved}
          style={{
            ...styles.saveButton,
            opacity: isSaved ? 0.7 : 1
          }}
        >
          {isSaved
            ? '⭐ Saved'
            : '⭐ Save Job'}
        </button>

        <button
          onClick={openApplyForm}
          disabled={isApplied}
          style={{
            ...styles.applyButton,
            opacity: isApplied ? 0.7 : 1
          }}
        >
          {isApplied
            ? '✅ Already Applied'
            : 'Apply Now'}
        </button>

      </div>

    )}

    {showApplyForm && (

      <div style={styles.applyForm}>

        <h2>
          Apply for {job.title}
        </h2>

        {resumes.length === 0 ? (

          <div>

            <p style={styles.warning}>
              ⚠️ You have not uploaded a resume yet.
            </p>

            <p>
              Please upload a resume from
              <strong> My Resume </strong>
              before applying.
            </p>

          </div>

        ) : (

          <form onSubmit={applyJob}>

            <div style={styles.formGroup}>

              <label>
                Select Resume
              </label>

              <select
                value={selectedResume}
                onChange={(e) =>
                  setSelectedResume(e.target.value)
                }
                style={styles.input}
              >

                <option value="">
                  -- Select Resume --
                </option>

                {resumes.map((resume) => (

                  <option
                    key={resume.id}
                    value={resume.id}
                  >
                    {resume.fileName}
                  </option>

                ))}

              </select>

            </div>

            <div style={styles.formGroup}>

              <label>
                Cover Letter
              </label>

              <textarea
                rows="6"
                value={coverLetter}
                onChange={(e) =>
                  setCoverLetter(e.target.value)
                }
                placeholder="Write a short cover letter explaining why you are suitable for this job..."
                style={styles.textarea}
              />

            </div>

            <div style={styles.formButtons}>

              <button
                type="submit"
                disabled={applying}
                style={styles.applyButton}
              >
                {applying
                  ? 'Submitting...'
                  : 'Submit Application'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowApplyForm(false)
                  setError('')
                }}
                style={styles.cancelButton}
              >
                Cancel
              </button>

            </div>

          </form>

        )}

      </div>

    )}

  </div>

</div>

)
}

const styles = {

page: {
padding: '40px',
maxWidth: '1000px',
margin: '0 auto',
fontFamily: 'Arial, sans-serif',
backgroundColor: '#f8fafc',
minHeight: '80vh'
},

jobCard: {
backgroundColor: 'white',
padding: '35px',
borderRadius: '12px',
border: '1px solid #e2e8f0',
boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
},

title: {
marginTop: '0',
color: '#0f172a',
fontSize: '32px'
},

description: {
lineHeight: '1.7',
color: '#475569'
},

buttonContainer: {
marginTop: '30px',
display: 'flex',
gap: '12px',
flexWrap: 'wrap'
},

saveButton: {
padding: '12px 20px',
border: 'none',
borderRadius: '8px',
backgroundColor: '#fef3c7',
color: '#92400e',
fontWeight: 'bold',
cursor: 'pointer'
},

applyButton: {
padding: '12px 20px',
border: 'none',
borderRadius: '8px',
backgroundColor: '#2563eb',
color: 'white',
fontWeight: 'bold',
cursor: 'pointer'
},

cancelButton: {
padding: '12px 20px',
border: '1px solid #cbd5e1',
borderRadius: '8px',
backgroundColor: 'white',
color: '#334155',
fontWeight: 'bold',
cursor: 'pointer'
},

success: {
marginTop: '20px',
padding: '12px',
borderRadius: '8px',
backgroundColor: '#dcfce7',
color: '#166534'
},

error: {
marginTop: '20px',
padding: '12px',
borderRadius: '8px',
backgroundColor: '#fee2e2',
color: '#991b1b'
},

warning: {
padding: '12px',
borderRadius: '8px',
backgroundColor: '#fef3c7',
color: '#92400e'
},

applyForm: {
marginTop: '30px',
padding: '25px',
borderRadius: '10px',
backgroundColor: '#f8fafc',
border: '1px solid #e2e8f0'
},

formGroup: {
display: 'flex',
flexDirection: 'column',
gap: '8px',
marginBottom: '20px'
},

input: {
padding: '11px',
borderRadius: '7px',
border: '1px solid #cbd5e1',
fontSize: '15px'
},

textarea: {
padding: '11px',
borderRadius: '7px',
border: '1px solid #cbd5e1',
fontSize: '15px',
resize: 'vertical'
},

formButtons: {
display: 'flex',
gap: '10px'
}

}

export default JobDetails