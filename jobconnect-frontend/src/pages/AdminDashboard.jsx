import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import './AdminDashboard.css'

function AdminDashboard() {

const navigate = useNavigate()

const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobSeekers: 0,
    totalRecruiters: 0,
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0
})

const [loading, setLoading] = useState(true)
const [error, setError] = useState('')

useEffect(() => {
    loadDashboard()
}, [])

const loadDashboard = async () => {

    try {

        setLoading(true)
        setError('')

        const response = await api.get('/admin/dashboard')

        console.log('Admin Dashboard:', response.data)

        setStats(response.data)

    } catch (error) {

        console.error('Admin Dashboard Error:', error)

        setError(
            error.response?.data?.message ||
            'Unable to load admin dashboard'
        )

    } finally {

        setLoading(false)

    }
}

if (loading) {

    return (
        <div className="admin-loading">

            <div className="admin-loading-content">

                <div className="admin-spinner"></div>

                <h2>Loading Admin Dashboard...</h2>

                <p>
                    Please wait while we load the platform statistics.
                </p>

            </div>

        </div>
    )
}

if (error) {

    return (
        <div className="admin-dashboard">

            <div className="admin-error">

                <div className="admin-error-icon">
                    ⚠️
                </div>

                <h2>Something went wrong</h2>

                <p>{error}</p>

                <button
                    className="admin-refresh-button"
                    onClick={loadDashboard}
                >
                    Try Again
                </button>

            </div>

        </div>
    )
}

return (

    <div className="admin-dashboard">

        <div className="admin-dashboard-header">

            <div>

                <span className="admin-header-badge">
                    ADMIN PANEL
                </span>

                <h1>
                    Admin Dashboard
                </h1>

                <p>
                    Manage and monitor the JobConnect platform
                </p>

            </div>

            <button
                className="admin-refresh-button"
                onClick={loadDashboard}
            >
                🔄 Refresh
            </button>

        </div>


        <div className="admin-stats-grid">

            <div className="admin-stat-card">

                <div className="admin-stat-icon">
                    👥
                </div>

                <div className="admin-stat-content">

                    <h3>
                        Total Users
                    </h3>

                    <p>
                        {stats.totalUsers}
                    </p>

                    <span>
                        Registered users
                    </span>

                </div>

            </div>


            <div className="admin-stat-card">

                <div className="admin-stat-icon">
                    👨‍💼
                </div>

                <div className="admin-stat-content">

                    <h3>
                        Job Seekers
                    </h3>

                    <p>
                        {stats.totalJobSeekers}
                    </p>

                    <span>
                        Active candidates
                    </span>

                </div>

            </div>


            <div className="admin-stat-card">

                <div className="admin-stat-icon">
                    🏢
                </div>

                <div className="admin-stat-content">

                    <h3>
                        Recruiters
                    </h3>

                    <p>
                        {stats.totalRecruiters}
                    </p>

                    <span>
                        Hiring companies
                    </span>

                </div>

            </div>


            <div className="admin-stat-card">

                <div className="admin-stat-icon">
                    💼
                </div>

                <div className="admin-stat-content">

                    <h3>
                        Total Jobs
                    </h3>

                    <p>
                        {stats.totalJobs}
                    </p>

                    <span>
                        Posted jobs
                    </span>

                </div>

            </div>


            <div className="admin-stat-card">

                <div className="admin-stat-icon">
                    ✅
                </div>

                <div className="admin-stat-content">

                    <h3>
                        Active Jobs
                    </h3>

                    <p>
                        {stats.activeJobs}
                    </p>

                    <span>
                        Currently available
                    </span>

                </div>

            </div>


            <div className="admin-stat-card">

                <div className="admin-stat-icon">
                    📄
                </div>

                <div className="admin-stat-content">

                    <h3>
                        Applications
                    </h3>

                    <p>
                        {stats.totalApplications}
                    </p>

                    <span>
                        Total applications
                    </span>

                </div>

            </div>

        </div>


        <div className="admin-overview-section">

            <div className="admin-section-heading">

                <div>

                    <h2>
                        Platform Overview
                    </h2>

                    <p>
                        Quick overview of your JobConnect platform
                    </p>

                </div>

            </div>


            <div className="admin-overview-grid">

                <div className="admin-overview-item">

                    <span className="overview-label">
                        Users
                    </span>

                    <strong>
                        {stats.totalUsers}
                    </strong>

                    <span className="overview-description">
                        Total registered accounts
                    </span>

                </div>


                <div className="admin-overview-item">

                    <span className="overview-label">
                        Jobs
                    </span>

                    <strong>
                        {stats.totalJobs}
                    </strong>

                    <span className="overview-description">
                        Total jobs posted
                    </span>

                </div>


                <div className="admin-overview-item">

                    <span className="overview-label">
                        Active Jobs
                    </span>

                    <strong>
                        {stats.activeJobs}
                    </strong>

                    <span className="overview-description">
                        Jobs currently available
                    </span>

                </div>


                <div className="admin-overview-item">

                    <span className="overview-label">
                        Applications
                    </span>

                    <strong>
                        {stats.totalApplications}
                    </strong>

                    <span className="overview-description">
                        Applications submitted
                    </span>

                </div>

            </div>

        </div>


        <div className="admin-management-section">

            <div className="admin-section-heading">

                <div>

                    <h2>
                        Management
                    </h2>

                    <p>
                        Manage different areas of the JobConnect platform
                    </p>

                </div>

            </div>


            <div className="admin-management-grid">


                <div
                    className="admin-management-card"
                    onClick={() => navigate('/admin/users')}
                >

                    <div className="admin-management-icon">
                        👥
                    </div>

                    <div className="admin-management-content">

                        <h3>
                            Manage Users
                        </h3>

                        <p>
                            View, activate, deactivate and block platform users.
                        </p>

                        <button>
                            Manage Users →
                        </button>

                    </div>

                </div>


                <div
                    className="admin-management-card"
                    onClick={() => navigate('/admin/jobs')}
                >

                    <div className="admin-management-icon">
                        💼
                    </div>

                    <div className="admin-management-content">

                        <h3>
                            Manage Jobs
                        </h3>

                        <p>
                            View and manage jobs posted by recruiters.
                        </p>

                        <button>
                            Manage Jobs →
                        </button>

                    </div>

                </div>


                <div
                    className="admin-management-card"
                    onClick={() => navigate('/admin/applications')}
                >

                    <div className="admin-management-icon">
                        📄
                    </div>

                    <div className="admin-management-content">

                        <h3>
                            Manage Applications
                        </h3>

                        <p>
                            Monitor applications submitted by job seekers.
                        </p>

                        <button>
                            Manage Applications →
                        </button>

                    </div>

                </div>


                <div
                    className="admin-management-card"
                    onClick={() => navigate('/admin/categories')}
                >

                    <div className="admin-management-icon">
                        📂
                    </div>

                    <div className="admin-management-content">

                        <h3>
                            Manage Categories
                        </h3>

                        <p>
                            Add, edit and delete job categories.
                        </p>

                        <button>
                            Manage Categories →
                        </button>

                    </div>

                </div>

            </div>

        </div>


        <div className="admin-dashboard-footer">

            <p>
                JobConnect Admin Panel
            </p>

            <span>
                Platform management and monitoring
            </span>

        </div>

    </div>
)

}

export default AdminDashboard