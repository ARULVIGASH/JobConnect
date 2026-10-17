import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function RecruiterDashboard() {

  const [dashboard, setDashboard] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    selectedCandidates: 0
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const recruiterId = localStorage.getItem('recruiterId')

  useEffect(() => {

    if (recruiterId) {
      loadDashboard()
    } else {
      setError('Recruiter information not found. Please login again.')
      setLoading(false)
    }

  }, [recruiterId])


  const loadDashboard = async () => {

    try {

      const response = await api.get(
        '/recruiter/dashboard/' + recruiterId
      )

      console.log('Dashboard:', response.data)

      setDashboard(response.data)

    } catch (error) {

      console.error('Dashboard loading error:', error)

      setError(
        error.response?.data?.message ||
        'Unable to load dashboard'
      )

    } finally {

      setLoading(false)

    }
  }


  if (loading) {

    return (
      <div style={styles.page}>
        <h2>Loading dashboard...</h2>
      </div>
    )

  }


  if (error) {

    return (
      <div style={styles.page}>
        <h2>{error}</h2>
      </div>
    )

  }


  return (

    <div style={styles.page}>

      <h1 style={styles.title}>
        Recruiter Dashboard
      </h1>

      <p style={styles.subtitle}>
        Manage your jobs and track candidate applications.
      </p>


      {/* STATISTICS */}

      <div style={styles.statsContainer}>

        {/* TOTAL JOBS */}

        <div style={styles.card}>

          <div style={styles.icon}>
            💼
          </div>

          <div>
            <p style={styles.cardLabel}>
              Total Jobs
            </p>

            <h2 style={styles.number}>
              {dashboard.totalJobs}
            </h2>
          </div>

        </div>


        {/* ACTIVE JOBS */}

        <div style={styles.card}>

          <div style={styles.icon}>
            ✅
          </div>

          <div>
            <p style={styles.cardLabel}>
              Active Jobs
            </p>

            <h2 style={styles.number}>
              {dashboard.activeJobs}
            </h2>
          </div>

        </div>


        {/* APPLICATIONS */}

        <div style={styles.card}>

          <div style={styles.icon}>
            📄
          </div>

          <div>
            <p style={styles.cardLabel}>
              Applications
            </p>

            <h2 style={styles.number}>
              {dashboard.totalApplications}
            </h2>
          </div>

        </div>


        {/* SELECTED */}

        <div style={styles.card}>

          <div style={styles.icon}>
            🎯
          </div>

          <div>
            <p style={styles.cardLabel}>
              Selected Candidates
            </p>

            <h2 style={styles.number}>
              {dashboard.selectedCandidates}
            </h2>
          </div>

        </div>

      </div>


      {/* QUICK ACTIONS */}

      <div style={styles.actionsSection}>

        <h2>
          Quick Actions
        </h2>

        <div style={styles.actions}>

          <Link
            to="/recruiter/post-job"
            style={styles.actionButton}
          >
            ➕ Post New Job
          </Link>


          <Link
            to="/recruiter/jobs"
            style={styles.actionButton}
          >
            💼 My Jobs
          </Link>

        </div>

      </div>

    </div>
  )
}


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

  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px'
  },

  card: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '18px'
  },

  icon: {
    fontSize: '35px'
  },

  cardLabel: {
    margin: '0 0 5px',
    color: '#64748b',
    fontSize: '14px'
  },

  number: {
    margin: '0',
    color: '#0f172a',
    fontSize: '30px'
  },

  actionsSection: {
    marginTop: '40px',
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },

  actions: {
    display: 'flex',
    gap: '15px',
    marginTop: '20px'
  },

  actionButton: {
    textDecoration: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    backgroundColor: '#2563eb',
    color: 'white',
    fontWeight: 'bold'
  }

}

export default RecruiterDashboard