import { useEffect, useState } from 'react'
import api from '../services/api'
import './AdminApplications.css'

function AdminApplications() {

const [applications, setApplications] = useState([])
const [filteredApplications, setFilteredApplications] = useState([])

const [search, setSearch] = useState('')
const [statusFilter, setStatusFilter] = useState('')

const [loading, setLoading] = useState(true)
const [error, setError] = useState('')

useEffect(() => {
loadApplications()
}, [])

useEffect(() => {
filterApplications()
}, [applications, search, statusFilter])

const loadApplications = async () => {

try {

  setLoading(true)
  setError('')

  const response = await api.get('/admin/applications')

  console.log('Admin Applications:', response.data)

  setApplications(response.data)

} catch (error) {

  console.error('Admin Applications Error:', error)

  setError(
    error.response?.data?.message ||
    'Unable to load applications'
  )

} finally {

  setLoading(false)

}

}

const filterApplications = () => {

let result = [...applications]

const searchValue = search.trim().toLowerCase()

if (searchValue) {

  result = result.filter(application => {

    const jobTitle =
      application.job?.title?.toLowerCase() || ''

    const applicantName =
      application.seeker?.user?.name?.toLowerCase() || ''

    const applicantEmail =
      application.seeker?.user?.email?.toLowerCase() || ''

    return (
      jobTitle.includes(searchValue) ||
      applicantName.includes(searchValue) ||
      applicantEmail.includes(searchValue)
    )

  })

}

if (statusFilter) {

  result = result.filter(
    application =>
      application.status === statusFilter
  )

}

setFilteredApplications(result)

}

const clearFilters = () => {

setSearch('')
setStatusFilter('')

}

const getStatusLabel = (status) => {

if (!status) {
  return '-'
}

return status
  .replaceAll('_', ' ')
  .replace(/\b\w/g, letter => letter.toUpperCase())

}

const formatDate = (date) => {

if (!date) {
  return '-'
}

return new Date(date).toLocaleDateString()

}

const totalApplications = applications.length

const pendingApplications = applications.filter(
application =>
application.status === 'PENDING'
).length

const acceptedApplications = applications.filter(
application =>
application.status === 'ACCEPTED'
).length

const rejectedApplications = applications.filter(
application =>
application.status === 'REJECTED'
).length

if (loading) {

return (
  <div className="admin-applications-loading">

    <div className="admin-applications-loading-content">

      <div className="admin-applications-spinner"></div>

      <h2>Loading Applications...</h2>

      <p>
        Please wait while we load application information.
      </p>

    </div>

  </div>
)

}

if (error) {

return (
  <div className="admin-applications">

    <div className="admin-applications-error">

      <div className="admin-applications-error-icon">
        ⚠️
      </div>

      <h2>Unable to Load Applications</h2>

      <p>{error}</p>

      <button onClick={loadApplications}>
        Try Again
      </button>

    </div>

  </div>
)

}

return (
<div className="admin-applications">

  <div className="admin-applications-header">

    <div>

      <span className="admin-applications-badge">
        ADMIN PANEL
      </span>

      <h1>Application Management</h1>

      <p>
        Monitor job applications across the JobConnect platform
      </p>

    </div>

    <button
      className="admin-applications-refresh"
      onClick={loadApplications}
    >
      ↻ Refresh
    </button>

  </div>

  <div className="admin-applications-summary">

    <div className="admin-applications-summary-card">

      <span>Total Applications</span>

      <strong>{totalApplications}</strong>

    </div>

    <div className="admin-applications-summary-card">

      <span>Pending</span>

      <strong>{pendingApplications}</strong>

    </div>

    <div className="admin-applications-summary-card">

      <span>Accepted</span>

      <strong>{acceptedApplications}</strong>

    </div>

    <div className="admin-applications-summary-card">

      <span>Rejected</span>

      <strong>{rejectedApplications}</strong>

    </div>

  </div>

  <div className="admin-applications-filter-box">

    <div className="admin-applications-filter-group">

      <label>Search Applications</label>

      <input
        type="text"
        placeholder="Search job, applicant or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

    </div>

    <div className="admin-applications-filter-group">

      <label>Status</label>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >

        <option value="">
          All Status
        </option>

        <option value="PENDING">
          Pending
        </option>

        <option value="ACCEPTED">
          Accepted
        </option>

        <option value="REJECTED">
          Rejected
        </option>

      </select>

    </div>

    <button
      className="admin-applications-clear"
      onClick={clearFilters}
    >
      Clear Filters
    </button>

  </div>

  <div className="admin-applications-result-bar">

    <p>
      Showing <strong>{filteredApplications.length}</strong> of{' '}
      <strong>{totalApplications}</strong> applications
    </p>

  </div>

  {filteredApplications.length > 0 ? (

    <div className="admin-applications-table-container">

      <table className="admin-applications-table">

        <thead>

          <tr>

            <th>ID</th>
            <th>Job</th>
            <th>Applicant</th>
            <th>Resume</th>
            <th>Status</th>
            <th>Applied Date</th>

          </tr>

        </thead>

        <tbody>

          {filteredApplications.map(application => (

            <tr key={application.id}>

              <td>
                #{application.id}
              </td>

              <td>

                <div className="admin-application-job">

                  <div className="admin-application-icon">
                    💼
                  </div>

                  <div>

                    <strong>
                      {application.job?.title || 'Unknown Job'}
                    </strong>

                    {application.job?.company?.name && (
                      <span>
                        {application.job.company.name}
                      </span>
                    )}

                  </div>

                </div>

              </td>

              <td>

                <div className="admin-application-applicant">

                  <div className="admin-applicant-avatar">

                    {application.seeker?.user?.name
                      ? application.seeker.user.name
                          .charAt(0)
                          .toUpperCase()
                      : '?'}

                  </div>

                  <div>

                    <strong>
                      {application.seeker?.user?.name || '-'}
                    </strong>

                    {application.seeker?.user?.email && (
                      <span>
                        {application.seeker.user.email}
                      </span>
                    )}

                  </div>

                </div>

              </td>

              <td>

                {application.resume ? (

                  <span className="admin-resume-available">
                    Available
                  </span>

                ) : (

                  <span className="admin-resume-missing">
                    No Resume
                  </span>

                )}

              </td>

              <td>

                <span
                  className={`admin-application-status ${
                    application.status
                      ? application.status.toLowerCase()
                      : ''
                  }`}
                >

                  {getStatusLabel(application.status)}

                </span>

              </td>

              <td>
                {formatDate(application.appliedAt)}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  ) : (

    <div className="admin-no-applications">

      <div className="admin-no-applications-icon">
        📋
      </div>

      <h3>No Applications Found</h3>

      <p>
        No applications match your current search or filter.
      </p>

      <button
        className="admin-applications-clear"
        onClick={clearFilters}
      >
        Clear Filters
      </button>

    </div>

  )}

</div>

)

}

export default AdminApplications