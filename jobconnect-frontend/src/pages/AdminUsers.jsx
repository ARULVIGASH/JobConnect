import { useEffect, useState } from 'react'
import api from '../services/api'
import './AdminUsers.css'

function AdminUsers() {

const [users, setUsers] = useState([])
const [filteredUsers, setFilteredUsers] = useState([])

const [search, setSearch] = useState('')
const [roleFilter, setRoleFilter] = useState('')
const [statusFilter, setStatusFilter] = useState('')

const [loading, setLoading] = useState(true)
const [error, setError] = useState('')

useEffect(() => {
    loadUsers()
}, [])

useEffect(() => {
    filterUsers()
}, [users, search, roleFilter, statusFilter])

const loadUsers = async () => {

    try {

        setLoading(true)
        setError('')

        const response = await api.get('/users')

        console.log('Admin Users:', response.data)

        setUsers(response.data)

    } catch (error) {

        console.error('Users Error:', error)

        setError(
            error.response?.data?.message ||
            'Unable to load users'
        )

    } finally {

        setLoading(false)

    }
}

const filterUsers = () => {

    let results = [...users]

    if (search.trim() !== '') {

        const searchText = search.trim().toLowerCase()

        results = results.filter(user =>
            (user.name || '').toLowerCase().includes(searchText) ||
            (user.email || '').toLowerCase().includes(searchText) ||
            (user.phone || '').toLowerCase().includes(searchText)
        )
    }

    if (roleFilter !== '') {

        results = results.filter(
            user => user.role === roleFilter
        )
    }

    if (statusFilter !== '') {

        results = results.filter(
            user => user.status === statusFilter
        )
    }

    setFilteredUsers(results)
}

const clearFilters = () => {

    setSearch('')
    setRoleFilter('')
    setStatusFilter('')

}

const updateStatus = async (userId, status) => {

    const actionText =
        status === 'BLOCKED'
            ? 'block'
            : 'activate'

    const confirmed = window.confirm(
        `Are you sure you want to ${actionText} this user?`
    )

    if (!confirmed) {
        return
    }

    try {

        await api.put(
            `/users/${userId}/status?status=${status}`
        )

        setUsers(previousUsers =>
            previousUsers.map(user =>
                user.id === userId
                    ? { ...user, status: status }
                    : user
            )
        )

        alert(
            status === 'BLOCKED'
                ? 'User blocked successfully!'
                : 'User activated successfully!'
        )

    } catch (error) {

        console.error('Status Update Error:', error)

        alert(
            error.response?.data?.message ||
            'Unable to update user status'
        )
    }
}

const getRoleLabel = (role) => {

    if (!role) {
        return '-'
    }

    return role
        .replaceAll('_', ' ')
        .replace(
            /\w\S*/g,
            word =>
                word.charAt(0).toUpperCase() +
                word.substring(1).toLowerCase()
        )
}

const getStatusLabel = (status) => {

    if (!status) {
        return '-'
    }

    return status.charAt(0) +
        status.substring(1).toLowerCase()
}

if (loading) {

    return (
        <div className="admin-users-loading">

            <div className="admin-users-loading-content">

                <div className="admin-users-spinner"></div>

                <h2>
                    Loading Users...
                </h2>

                <p>
                    Please wait while we load user information.
                </p>

            </div>

        </div>
    )
}

if (error) {

    return (
        <div className="admin-users">

            <div className="admin-users-error">

                <div className="admin-users-error-icon">
                    ⚠️
                </div>

                <h2>
                    Unable to Load Users
                </h2>

                <p>
                    {error}
                </p>

                <button
                    onClick={loadUsers}
                    className="admin-users-refresh"
                >
                    Try Again
                </button>

            </div>

        </div>
    )
}

return (

    <div className="admin-users">

        <div className="admin-users-header">

            <div>

                <span className="admin-users-badge">
                    ADMIN PANEL
                </span>

                <h1>
                    User Management
                </h1>

                <p>
                    Manage JobConnect users and account status
                </p>

            </div>

            <button
                className="admin-users-refresh"
                onClick={loadUsers}
            >
                🔄 Refresh
            </button>

        </div>


        <div className="admin-users-summary">

            <div className="admin-users-summary-card">

                <span>
                    Total Users
                </span>

                <strong>
                    {users.length}
                </strong>

            </div>

            <div className="admin-users-summary-card">

                <span>
                    Job Seekers
                </span>

                <strong>
                    {
                        users.filter(
                            user => user.role === 'JOB_SEEKER'
                        ).length
                    }
                </strong>

            </div>

            <div className="admin-users-summary-card">

                <span>
                    Recruiters
                </span>

                <strong>
                    {
                        users.filter(
                            user => user.role === 'RECRUITER'
                        ).length
                    }
                </strong>

            </div>

            <div className="admin-users-summary-card">

                <span>
                    Active Users
                </span>

                <strong>
                    {
                        users.filter(
                            user => user.status === 'ACTIVE'
                        ).length
                    }
                </strong>

            </div>

        </div>


        <div className="admin-users-filter-box">

            <div className="admin-users-filter-group">

                <label>
                    Search Users
                </label>

                <input
                    type="text"
                    placeholder="Search by name, email or phone"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>


            <div className="admin-users-filter-group">

                <label>
                    Role
                </label>

                <select
                    value={roleFilter}
                    onChange={(e) =>
                        setRoleFilter(e.target.value)
                    }
                >

                    <option value="">
                        All Roles
                    </option>

                    <option value="JOB_SEEKER">
                        Job Seeker
                    </option>

                    <option value="RECRUITER">
                        Recruiter
                    </option>

                    <option value="ADMIN">
                        Admin
                    </option>

                </select>

            </div>


            <div className="admin-users-filter-group">

                <label>
                    Status
                </label>

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
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

                    <option value="BLOCKED">
                        Blocked
                    </option>

                </select>

            </div>


            <button
                className="admin-users-clear"
                onClick={clearFilters}
            >
                Clear Filters
            </button>

        </div>


        <div className="admin-users-result-bar">

            <p>
                Showing <strong>{filteredUsers.length}</strong> of{' '}
                <strong>{users.length}</strong> users
            </p>

        </div>


        {filteredUsers.length === 0 ? (

            <div className="admin-no-users">

                <div className="admin-no-users-icon">
                    👥
                </div>

                <h3>
                    No Users Found
                </h3>

                <p>
                    No users match your current search or filters.
                </p>

                <button
                    onClick={clearFilters}
                    className="admin-users-clear"
                >
                    Clear Filters
                </button>

            </div>

        ) : (

            <div className="admin-users-table-container">

                <table className="admin-users-table">

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {filteredUsers.map(user => (

                            <tr key={user.id}>

                                <td>
                                    #{user.id}
                                </td>

                                <td>

                                    <div className="admin-user-info">

                                        <div className="admin-user-avatar">
                                            {user.name
                                                ? user.name
                                                    .charAt(0)
                                                    .toUpperCase()
                                                : '?'}
                                        </div>

                                        <div>
                                            <strong>
                                                {user.name || '-'}
                                            </strong>
                                        </div>

                                    </div>

                                </td>

                                <td>
                                    {user.email || '-'}
                                </td>

                                <td>
                                    {user.phone || '-'}
                                </td>

                                <td>

                                    <span
                                        className={`admin-role ${
                                            user.role
                                                ? user.role.toLowerCase()
                                                : ''
                                        }`}
                                    >
                                        {getRoleLabel(user.role)}
                                    </span>

                                </td>

                                <td>

                                    <span
                                        className={`admin-status ${
                                            user.status
                                                ? user.status.toLowerCase()
                                                : ''
                                        }`}
                                    >

                                        <span className="status-dot"></span>

                                        {getStatusLabel(user.status)}

                                    </span>

                                </td>

                                <td>

                                    {user.role === 'ADMIN' ? (

                                        <span className="admin-protected">
                                            🔒 Protected
                                        </span>

                                    ) : user.status === 'ACTIVE' ? (

                                        <button
                                            className="admin-block-button"
                                            onClick={() =>
                                                updateStatus(
                                                    user.id,
                                                    'BLOCKED'
                                                )
                                            }
                                        >
                                            Block
                                        </button>

                                    ) : (

                                        <button
                                            className="admin-activate-button"
                                            onClick={() =>
                                                updateStatus(
                                                    user.id,
                                                    'ACTIVE'
                                                )
                                            }
                                        >
                                            Activate
                                        </button>

                                    )}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        )}

    </div>
)

}

export default AdminUsers