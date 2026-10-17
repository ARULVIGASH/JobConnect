import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Notifications from './pages/Notifications'
import RecruiterApplications from './pages/RecruiterApplications'
import RecruiterDashboard from './pages/RecruiterDashboard'
import RecruiterJobs from './pages/RecruiterJobs'
import PostJob from './pages/PostJob'
import SavedJobs from './pages/SavedJobs'
import Resume from './pages/Resume'
import MyProfile from './pages/MyProfile'
import EditJob from './pages/EditJob'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminJobs from './pages/AdminJobs'
import AdminApplications from './pages/AdminApplications'
import AdminCategories from './pages/AdminCategories'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Jobs from './pages/Jobs'
import JobDetails from './pages/JobDetails'
import MyApplications from './pages/MyApplications'

function ProtectedRoute({ children, allowedRoles }) {

const token = localStorage.getItem('token')
const role = localStorage.getItem('role')

if (!token) {
return <Navigate to="/login" replace />
}

if (allowedRoles && !allowedRoles.includes(role)) {

if (role === 'ADMIN') {
  return <Navigate to="/admin" replace />
}

if (role === 'RECRUITER') {
  return <Navigate to="/recruiter/dashboard" replace />
}

if (role === 'JOB_SEEKER') {
  return <Navigate to="/jobs" replace />
}

return <Navigate to="/login" replace />

}

return children
}

function App() {

return (

<BrowserRouter>

  <Navbar />

  <Routes>

    {/* PUBLIC PAGES */}

    <Route
      path="/"
      element={<Home />}
    />

    <Route
      path="/login"
      element={<Login />}
    />

    <Route
      path="/register"
      element={<Register />}
    />

    <Route
      path="/jobs"
      element={<Jobs />}
    />

    <Route
      path="/jobs/:id"
      element={<JobDetails />}
    />


    {/* JOB SEEKER PAGES */}

    <Route
      path="/saved-jobs"
      element={
        <ProtectedRoute allowedRoles={['JOB_SEEKER']}>
          <SavedJobs />
        </ProtectedRoute>
      }
    />

    <Route
      path="/resume"
      element={
        <ProtectedRoute allowedRoles={['JOB_SEEKER']}>
          <Resume />
        </ProtectedRoute>
      }
    />

    <Route
      path="/notifications"
      element={
        <ProtectedRoute
          allowedRoles={[
            'JOB_SEEKER',
            'RECRUITER',
            'ADMIN'
          ]}
        >
          <Notifications />
        </ProtectedRoute>
      }
    />

    <Route
      path="/my-applications"
      element={
        <ProtectedRoute allowedRoles={['JOB_SEEKER']}>
          <MyApplications />
        </ProtectedRoute>
      }
    />

    <Route
      path="/my-profile"
      element={
        <ProtectedRoute allowedRoles={['JOB_SEEKER']}>
          <MyProfile />
        </ProtectedRoute>
      }
    />


    {/* RECRUITER PAGES */}

    <Route
      path="/recruiter/dashboard"
      element={
        <ProtectedRoute allowedRoles={['RECRUITER']}>
          <RecruiterDashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/recruiter/post-job"
      element={
        <ProtectedRoute allowedRoles={['RECRUITER']}>
          <PostJob />
        </ProtectedRoute>
      }
    />

    <Route
      path="/recruiter/jobs"
      element={
        <ProtectedRoute allowedRoles={['RECRUITER']}>
          <RecruiterJobs />
        </ProtectedRoute>
      }
    />

    <Route
      path="/recruiter/edit-job/:id"
      element={
        <ProtectedRoute allowedRoles={['RECRUITER']}>
          <EditJob />
        </ProtectedRoute>
      }
    />

    <Route
      path="/recruiter/applications/:jobId"
      element={
        <ProtectedRoute allowedRoles={['RECRUITER']}>
          <RecruiterApplications />
        </ProtectedRoute>
      }
    />


    {/* ADMIN PAGES */}

    <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/users"
      element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminUsers />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/jobs"
      element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminJobs />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/applications"
      element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminApplications />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/categories"
      element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminCategories />
        </ProtectedRoute>
      }
    />


    {/* UNKNOWN URL */}

    <Route
      path="*"
      element={<Navigate to="/" replace />}
    />

  </Routes>

</BrowserRouter>

)
}

export default App