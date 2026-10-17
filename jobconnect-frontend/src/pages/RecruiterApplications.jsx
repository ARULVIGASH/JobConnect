
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'

function RecruiterApplications() {
  const { jobId } = useParams()

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadApplications()
  }, [jobId])

  const loadApplications = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get(`/applications/job/${jobId}`)
      setApplications(response.data)
    } catch (error) {
      console.error('Error loading applications:', error)
      setError('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (applicationId, status) => {
    try {
      await api.put(`/applications/${applicationId}/status`, {
        status
      })

      await loadApplications()
      alert(`Application status updated to ${status}`)
    } catch (error) {
      console.error('Status update error:', error)
      alert('Failed to update application status')
    }
  }

  const getResumeFile = async (resumeId) => {
    const response = await api.get(`/resumes/download/${resumeId}`, {
      responseType: 'blob'
    })

    const contentType = response.headers['content-type'] || ''
    const blob = response.data

    // Detect if the backend returned an error instead of a resume.
    if (contentType.includes('application/json') || contentType.includes('text/plain')) {
      const errorText = await blob.text()
      console.error('Resume download response:', errorText)
      throw new Error('The server did not return a valid resume file.')
    }

    return {
      blob,
      contentType
    }
  }

  const viewResume = async (resumeId) => {
    let fileUrl

    try {
      const { blob, contentType } = await getResumeFile(resumeId)

      // Use the actual response content type whenever available.
      const file = new Blob([blob], {
        type: contentType || 'application/pdf'
      })

      fileUrl = window.URL.createObjectURL(file)

      const newTab = window.open(fileUrl, '_blank')

      if (!newTab) {
        // Browser may block the new tab.
        const link = document.createElement('a')
        link.href = fileUrl
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        link.click()
      }

      // Keep the temporary URL available while the file opens.
      setTimeout(() => {
        if (fileUrl) {
          window.URL.revokeObjectURL(fileUrl)
        }
      }, 120000)
    } catch (error) {
      console.error('Error viewing resume:', error)
      alert(
        error.response?.status === 403
          ? 'Access denied. Please check recruiter permissions.'
          : error.response?.status === 404
            ? 'Resume file was not found. The applicant may need to upload it again.'
            : 'Unable to open resume. Check the backend console for details.'
      )
    }
  }

  const downloadResume = async (resumeId, seekerName, originalFileName) => {
    let fileUrl

    try {
      const { blob, contentType } = await getResumeFile(resumeId)

      fileUrl = window.URL.createObjectURL(
        new Blob([blob], {
          type: contentType || 'application/octet-stream'
        })
      )

      const safeName = (seekerName || 'Applicant')
        .replace(/[^a-z0-9_-]/gi, '_')

      // Preserve the original file extension when available.
      const extensionMatch = (originalFileName || '').match(/\.[a-z0-9]+$/i)
      const extension = extensionMatch ? extensionMatch[0] : '.pdf'

      const link = document.createElement('a')
      link.href = fileUrl
      link.download = `Resume_${safeName}${extension}`

      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error downloading resume:', error)
      alert(
        error.response?.status === 403
          ? 'Access denied. Please check recruiter permissions.'
          : error.response?.status === 404
            ? 'Resume file was not found. Ask the applicant to upload it again.'
            : 'Unable to download resume. Check the backend console for details.'
      )
    } finally {
      if (fileUrl) {
        setTimeout(() => window.URL.revokeObjectURL(fileUrl), 60000)
      }
    }
  }

  if (loading) {
    return <h2>Loading applications...</h2>
  }

  if (error) {
    return <h2>{error}</h2>
  }

  return (
    <div style={{ padding: '30px' }}>
      <h1>Job Applications</h1>

      <p>
        <strong>Job ID:</strong> {jobId}
      </p>

      {applications.length === 0 ? (
        <p>No applications received yet.</p>
      ) : (
        applications.map((application) => (
          <div
            key={application.id}
            style={{
              border: '1px solid #ddd',
              padding: '20px',
              marginBottom: '20px',
              borderRadius: '8px'
            }}
          >
            <h2>{application.seekerName || 'Applicant'}</h2>

            <p>
              <strong>Application ID:</strong> {application.id}
            </p>

            <p>
              <strong>Job:</strong> {application.jobTitle}
            </p>

            <p>
              <strong>Cover Letter:</strong>
              <br />
              {application.coverLetter || 'No cover letter'}
            </p>

            <p>
              <strong>Current Status:</strong> {application.status}
            </p>

            <p>
              <strong>Applied At:</strong>{' '}
              {application.appliedAt
                ? new Date(application.appliedAt).toLocaleString()
                : 'Not available'}
            </p>

            <div style={{ marginBottom: '16px' }}>
              <strong>Applicant Resume:</strong>
              <br />

              {application.resumeId ? (
                <>
                  <button
                    type="button"
                    onClick={() => viewResume(application.resumeId)}
                    style={{ margin: '8px 8px 0 0', cursor: 'pointer' }}
                  >
                    View Resume
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      downloadResume(
                        application.resumeId,
                        application.seekerName,
                        application.resumeFileName
                      )
                    }
                    style={{ margin: '8px 0 0', cursor: 'pointer' }}
                  >
                    Download Resume
                  </button>
                </>
              ) : (
                <p>No resume was attached to this application.</p>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => updateStatus(application.id, 'SHORTLISTED')}
              >
                Shortlist
              </button>{' '}

              <button
                type="button"
                onClick={() => updateStatus(application.id, 'INTERVIEW')}
              >
                Interview
              </button>{' '}

              <button
                type="button"
                onClick={() => updateStatus(application.id, 'SELECTED')}
              >
                Select
              </button>{' '}

              <button
                type="button"
                onClick={() => updateStatus(application.id, 'REJECTED')}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default RecruiterApplications

