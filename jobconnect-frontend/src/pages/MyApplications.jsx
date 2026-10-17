import { useEffect, useState } from 'react'
import api from '../services/api'

function MyApplications() {

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const userId = localStorage.getItem('userId')

  useEffect(() => {

    if (userId) {
      loadApplications()
    } else {
      setError('Please login first')
      setLoading(false)
    }

  }, [userId])

  const loadApplications = async () => {

    try {

      // Get job seeker profile
      const seekerResponse = await api.get(
        '/job-seekers/user/' + userId
      )

      const seekerId = seekerResponse.data.id

      // Get applications
      const response = await api.get(
        '/applications/seeker/' + seekerId
      )

      console.log('Applications:', response.data)

      setApplications(response.data)

    } catch (error) {

      console.error('Applications loading error:', error)

      setError(
        error.response?.data?.message ||
        'Unable to load applications'
      )

    } finally {

      setLoading(false)

    }
  }

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status) => {

    if (status === 'SELECTED') {
      return {
        backgroundColor: '#dcfce7',
        color: '#166534'
      }
    }

    if (status === 'ACCEPTED') {
      return {
        backgroundColor: '#dcfce7',
        color: '#166534'
      }
    }

    if (status === 'REJECTED') {
      return {
        backgroundColor: '#fee2e2',
        color: '#991b1b'
      }
    }

    if (status === 'INTERVIEW') {
      return {
        backgroundColor: '#dbeafe',
        color: '#1e40af'
      }
    }

    if (status === 'SHORTLISTED') {
      return {
        backgroundColor: '#e0e7ff',
        color: '#3730a3'
      }
    }

    return {
      backgroundColor: '#fef3c7',
      color: '#92400e'
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div style={styles.page}>
        <h2>Loading applications...</h2>
      </div>
    )

  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (
      <div style={styles.page}>
        <h2>{error}</h2>
      </div>
    )

  }

  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div style={styles.page}>

      <h1 style={styles.title}>
        My Applications
      </h1>

      <p style={styles.subtitle}>
        Track the jobs you have applied for.
      </p>

      {applications.length === 0 ? (

        <div style={styles.empty}>

          <div style={styles.emptyIcon}>
            📄
          </div>

          <h2>
            No Applications Yet
          </h2>

          <p>
            You haven't applied for any jobs yet.
          </p>

        </div>

      ) : (

        <div style={styles.container}>

          {applications.map((application) => (

            <div
              key={application.id}
              style={styles.card}
            >

              {/* ==========================================
                  HEADER
              ========================================== */}

              <div style={styles.cardHeader}>

                <div>

                  <h2 style={styles.jobTitle}>
                    {application.jobTitle || 'Job'}
                  </h2>

                  <p style={styles.company}>
                    {application.companyName || 'Company'}
                  </p>

                </div>

                <span
                  style={{
                    ...styles.status,
                    ...getStatusStyle(application.status)
                  }}
                >
                  {application.status || 'APPLIED'}
                </span>

              </div>


              {/* ==========================================
                  JOB DETAILS
              ========================================== */}

              <div style={styles.details}>

                <p>
                  📍 <strong>Location:</strong>{' '}
                  {application.location || 'N/A'}
                </p>

                <p>
                  💼 <strong>Job Type:</strong>{' '}
                  {application.jobType || 'N/A'}
                </p>

                <p>
                  🏢 <strong>Work Mode:</strong>{' '}
                  {application.workMode || 'N/A'}
                </p>

                <p>
                  💰 <strong>Salary:</strong>{' '}
                  {application.salaryMin != null &&
                   application.salaryMax != null
                    ? `₹${application.salaryMin} - ₹${application.salaryMax}`
                    : 'N/A'}
                </p>

                <p>
                  📅 <strong>Applied:</strong>{' '}

                  {application.appliedAt
                    ? new Date(
                        application.appliedAt
                      ).toLocaleDateString()
                    : 'N/A'}
                </p>

              </div>


              {/* ==========================================
                  COVER LETTER
              ========================================== */}

              {application.coverLetter && (

                <div style={styles.coverLetter}>

                  <strong>
                    Cover Letter:
                  </strong>

                  <p>
                    {application.coverLetter}
                  </p>

                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </div>

  )
}


// ==========================================
// STYLES
// ==========================================

const styles = {

  page: {
    padding: '40px',
    maxWidth: '1100px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '80vh'
  },

  title: {
    margin: '0',
    color: '#0f172a',
    fontSize: '32px'
  },

  subtitle: {
    color: '#64748b',
    marginTop: '10px',
    marginBottom: '30px'
  },

  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },

  card: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
  },

  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px'
  },

  jobTitle: {
    margin: '0 0 8px',
    color: '#0f172a'
  },

  company: {
    margin: '0',
    color: '#64748b',
    fontWeight: 'bold'
  },

  status: {
    padding: '7px 12px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '13px',
    whiteSpace: 'nowrap'
  },

  details: {
    marginTop: '20px',
    color: '#475569',
    lineHeight: '1.5'
  },

  coverLetter: {
    marginTop: '15px',
    padding: '15px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    color: '#475569'
  },

  empty: {
    marginTop: '40px',
    padding: '50px',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    textAlign: 'center'
  },

  emptyIcon: {
    fontSize: '50px',
    marginBottom: '10px'
  }

}

export default MyApplications