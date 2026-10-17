import { useEffect, useState } from 'react'
import api from '../services/api'

function Resume() {
  const [file, setFile] = useState(null)
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(false)

  const userId = localStorage.getItem('userId')

  const loadResumes = async () => {
    try {
      const seekerResponse = await api.get('/job-seekers/user/' + userId)

      const seekerId = seekerResponse.data.id

      const resumeResponse = await api.get(
        '/resumes/seeker/' + seekerId
      )

      setResumes(resumeResponse.data)
    } catch (error) {
      console.error(error)
      alert('Unable to load resumes')
    }
  }

  useEffect(() => {
    if (userId) {
      loadResumes()
    }
  }, [userId])

  const handleUpload = async (e) => {
    e.preventDefault()

    if (!file) {
      alert('Please select a resume')
      return
    }

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file')
      return
    }

    try {
      setLoading(true)

      const seekerResponse = await api.get(
        '/job-seekers/user/' + userId
      )

      const seekerId = seekerResponse.data.id

      const formData = new FormData()

      formData.append('file', file)
      formData.append('jobSeekerId', seekerId)

      await api.post('/resumes/upload', formData)

      alert('Resume uploaded successfully!')

      setFile(null)

      document.getElementById('resumeFile').value = ''

      loadResumes()

    } catch (error) {
      console.error(error)

      alert(
        error.response?.data?.message ||
        'Resume upload failed'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (id, fileName) => {
    try {
      const response = await api.get(
        '/resumes/download/' + id,
        {
          responseType: 'blob'
        }
      )

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      )

      const link = document.createElement('a')

      link.href = url
      link.setAttribute('download', fileName)

      document.body.appendChild(link)

      link.click()

      link.remove()

      window.URL.revokeObjectURL(url)

    } catch (error) {
      console.error(error)
      alert('Unable to download resume')
    }
  }

  return (
    <div>
      <h1>My Resume</h1>

      <form onSubmit={handleUpload}>

        <input
          id="resumeFile"
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Resume'}
        </button>

      </form>

      <hr />

      <h2>Uploaded Resumes</h2>

      {resumes.length === 0 ? (
        <p>No resumes uploaded yet.</p>
      ) : (
        <div>

          {resumes.map((resume) => (
            <div key={resume.id}>

              <p>
                <strong>{resume.fileName}</strong>
              </p>

              <p>
                Uploaded: {resume.uploadDate || 'N/A'}
              </p>

              <button
                onClick={() =>
                  handleDownload(
                    resume.id,
                    resume.fileName
                  )
                }
              >
                Download
              </button>

            </div>
          ))}

        </div>
      )}
    </div>
  )
}

export default Resume