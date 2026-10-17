import { useEffect, useState } from 'react'
import api from '../services/api'
import './AdminJobs.css'

function AdminJobs() {

const [jobs, setJobs] = useState([])
const [filteredJobs, setFilteredJobs] = useState([])

const [search, setSearch] = useState('')
const [jobTypeFilter, setJobTypeFilter] = useState('')
const [workModeFilter, setWorkModeFilter] = useState('')
const [statusFilter, setStatusFilter] = useState('')

const [loading, setLoading] = useState(true)
const [error, setError] = useState('')

useEffect(() => {
loadJobs()
}, [])

useEffect(() => {
filterJobs()
}, [jobs, search, jobTypeFilter, workModeFilter, statusFilter])

const loadJobs = async () => {

try {

  setLoading(true)
  setError('')

  const response = await api.get('/admin/jobs')

  console.log('Admin Jobs:', response.data)

  setJobs(response.data)

} catch (error) {

  console.error('Admin Jobs Error:', error)

  setError(
    error.response?.data?.message ||
    'Unable to load jobs'
  )

} finally {

  setLoading(false)

}

}

const filterJobs = () => {

let result = [...jobs]

const searchValue = search.trim().toLowerCase()

if (searchValue) {

  result = result.filter(job => {

    const title = job.title?.toLowerCase() || ''
    const location = job.location?.toLowerCase() || ''
    const company = job.companyName?.toLowerCase() || ''

    return (
      title.includes(searchValue) ||
      location.includes(searchValue) ||
      company.includes(searchValue)
    )

  })

}

if (jobTypeFilter) {

  result = result.filter(
    job => job.jobType === jobTypeFilter
  )

}

if (workModeFilter) {

  result = result.filter(
    job => job.workMode === workModeFilter
  )

}

if (statusFilter) {

  result = result.filter(
    job => job.status === statusFilter
  )

}

setFilteredJobs(result)

}

const clearFilters = () => {

setSearch('')
setJobTypeFilter('')
setWorkModeFilter('')
setStatusFilter('')

}

const deleteJob = async (jobId) => {

const confirmed = window.confirm(
  'Are you sure you want to delete this job?'
)

if (!confirmed) {
  return
}

try {

  await api.delete(`/admin/jobs/${jobId}`)

  setJobs(previousJobs =>
    previousJobs.filter(job => job.id !== jobId)
  )

  alert('Job deleted successfully!')

} catch (error) {

  console.error('Delete Job Error:', error)

  alert(
    error.response?.data?.message ||
    'Unable to delete job'
  )

}

}

const getJobTypeLabel = (jobType) => {

if (!jobType) {
  return '-'
}

return jobType
  .replaceAll('_', ' ')
  .replace(/\b\w/g, letter => letter.toUpperCase())

}

const getWorkModeLabel = (workMode) => {

if (!workMode) {
  return '-'
}

return workMode
  .replaceAll('_', ' ')
  .replace(/\b\w/g, letter => letter.toUpperCase())

}

const getStatusLabel = (status) => {

if (!status) {
  return '-'
}

return status
  .replaceAll('_', ' ')
  .replace(/\b\w/g, letter => letter.toUpperCase())

}

const totalJobs = jobs.length

const activeJobs = jobs.filter(
job => job.status === 'ACTIVE'
).length

const inactiveJobs = jobs.filter(
job => job.status !== 'ACTIVE'
).length

if (loading) {

return (
  <div className="admin-jobs-loading">

    <div className="admin-jobs-loading-content">

      <div className="admin-jobs-spinner"></div>

      <h2>Loading Jobs...</h2>

      <p>Please wait while we load job information.</p>

    </div>

  </div>
)

}

if (error) {

return (
  <div className="admin-jobs">

    <div className="admin-jobs-error">

      <div className="admin-jobs-error-icon">
        ⚠️
      </div>

      <h2>Unable to Load Jobs</h2>

      <p>{error}</p>

      <button onClick={loadJobs}>
        Try Again
      </button>

    </div>

  </div>
)

}

return (
<div className="admin-jobs">

  <div className="admin-jobs-header">

    <div>

      <span className="admin-jobs-badge">
        ADMIN PANEL
      </span>

      <h1>Job Management</h1>

      <p>
        Manage and monitor jobs posted on JobConnect
      </p>

    </div>

    <button
      className="admin-jobs-refresh"
      onClick={loadJobs}
    >
      ↻ Refresh
    </button>

  </div>

  <div className="admin-jobs-summary">

    <div className="admin-jobs-summary-card">

      <span>Total Jobs</span>

      <strong>{totalJobs}</strong>

    </div>

    <div className="admin-jobs-summary-card">

      <span>Active Jobs</span>

      <strong>{activeJobs}</strong>

    </div>

    <div className="admin-jobs-summary-card">

      <span>Inactive Jobs</span>

      <strong>{inactiveJobs}</strong>

    </div>

  </div>

  <div className="admin-jobs-filter-box">

    <div className="admin-jobs-filter-group">

      <label>Search Jobs</label>

      <input
        type="text"
        placeholder="Search title, location or company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

    </div>

    <div className="admin-jobs-filter-group">

      <label>Job Type</label>

      <select
        value={jobTypeFilter}
        onChange={(e) => setJobTypeFilter(e.target.value)}
      >

        <option value="">
          All Job Types
        </option>

        <option value="FULL_TIME">
          Full Time
        </option>

        <option value="PART_TIME">
          Part Time
        </option>

        <option value="CONTRACT">
          Contract
        </option>

        <option value="INTERNSHIP">
          Internship
        </option>

      </select>

    </div>

    <div className="admin-jobs-filter-group">

      <label>Work Mode</label>

      <select
        value={workModeFilter}
        onChange={(e) => setWorkModeFilter(e.target.value)}
      >

        <option value="">
          All Work Modes
        </option>

        <option value="ONSITE">
          Onsite
        </option>

        <option value="REMOTE">
          Remote
        </option>

        <option value="HYBRID">
          Hybrid
        </option>

      </select>

    </div>

    <div className="admin-jobs-filter-group">

      <label>Status</label>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >

        <option value="">
          All Status
        </option>

        <option value="ACTIVE">
          Active
        </option>

        <option value="INACTIVE">
          Inactive
        </option>

        <option value="CLOSED">
          Closed
        </option>

      </select>

    </div>

    <button
      className="admin-jobs-clear"
      onClick={clearFilters}
    >
      Clear Filters
    </button>

  </div>

  <div className="admin-jobs-result-bar">

    <p>
      Showing <strong>{filteredJobs.length}</strong> of{' '}
      <strong>{totalJobs}</strong> jobs
    </p>

  </div>

  {filteredJobs.length > 0 ? (

    <div className="admin-jobs-table-container">

      <table className="admin-jobs-table">

        <thead>

          <tr>

            <th>ID</th>
            <th>Job</th>
            <th>Location</th>
            <th>Salary</th>
            <th>Job Type</th>
            <th>Work Mode</th>
            <th>Vacancies</th>
            <th>Status</th>
            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {filteredJobs.map(job => (

            <tr key={job.id}>

              <td>
                #{job.id}
              </td>

              <td>

                <div className="admin-job-info">

                  <div className="admin-job-icon">
                    💼
                  </div>

                  <div>

                    <strong>
                      {job.title || 'Untitled Job'}
                    </strong>

                    {job.companyName && (
                      <span>
                        {job.companyName}
                      </span>
                    )}

                  </div>

                </div>

              </td>

              <td>
                {job.location || '-'}
              </td>

              <td>

                ₹{job.salaryMin || 0} - ₹
                {job.salaryMax || 0}

              </td>

              <td>

                <span className="admin-job-type">

                  {getJobTypeLabel(job.jobType)}

                </span>

              </td>

              <td>

                {getWorkModeLabel(job.workMode)}

              </td>

              <td>
                {job.vacancies || 0}
              </td>

              <td>

                <span
                  className={`admin-job-status ${
                    job.status
                      ? job.status.toLowerCase()
                      : ''
                  }`}
                >

                  {getStatusLabel(job.status)}

                </span>

              </td>

              <td>

                <button
                  className="admin-delete-job-button"
                  onClick={() => deleteJob(job.id)}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  ) : (

    <div className="admin-no-jobs">

      <div className="admin-no-jobs-icon">
        💼
      </div>

      <h3>No Jobs Found</h3>

      <p>
        No jobs match your current search or filters.
      </p>

      <button
        className="admin-jobs-clear"
        onClick={clearFilters}
      >
        Clear Filters
      </button>

    </div>

  )}

</div>

)

}

export default AdminJobs