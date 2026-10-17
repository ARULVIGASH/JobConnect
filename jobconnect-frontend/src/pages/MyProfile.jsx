import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import './MyProfile.css'

function MyProfile() {

const [profile, setProfile] = useState({
id: '',
userId: '',
name: '',
email: '',
phone: '',
address: '',
experienceYears: 0,
skills: ''
})

const [loading, setLoading] = useState(true)
const [saving, setSaving] = useState(false)
const [editing, setEditing] = useState(false)

const userId = localStorage.getItem('userId')

useEffect(() => {
if (userId) {
loadProfile()
} else {
setLoading(false)
}
}, [userId])

const loadProfile = async () => {


try {

  const response = await api.get(
    '/job-seekers/user/' + userId
  )

  console.log('Profile:', response.data)

  setProfile(response.data)

} catch (error) {

  console.error('Profile loading error:', error)

  alert(
    error.response?.data?.message ||
    'Unable to load profile'
  )

} finally {

  setLoading(false)

}


}

const handleChange = (e) => {


setProfile({
  ...profile,
  [e.target.name]: e.target.value
})


}

const handleSubmit = async (e) => {


e.preventDefault()

try {

  setSaving(true)

  const response = await api.put(
    '/job-seekers/' + profile.id,
    {
      name: profile.name,
      phone: profile.phone,
      address: profile.address,
      experienceYears: Number(profile.experienceYears),
      skills: profile.skills
    }
  )

  setProfile(response.data)

  localStorage.setItem(
    'name',
    response.data.name
  )

  setEditing(false)

  alert('Profile updated successfully!')

} catch (error) {

  console.error('Profile update error:', error)

  alert(
    error.response?.data?.message ||
    'Profile update failed'
  )

} finally {

  setSaving(false)

}


}

if (loading) {
return ( <div className="profile-loading"> <h2>Loading profile...</h2> </div>
)
}

return (


<div className="profile-page">

  <div className="profile-container">

    <div className="profile-header">

      <div className="profile-avatar">
        {profile.name
          ? profile.name.charAt(0).toUpperCase()
          : 'U'}
      </div>

      <div className="profile-header-info">

        <h1>{profile.name || 'Job Seeker'}</h1>

        <p>Job Seeker</p>

        <span>
          Manage your professional profile and career information
        </span>

      </div>

      {!editing && (
        <button
          className="edit-profile-button"
          onClick={() => setEditing(true)}
        >
          Edit Profile
        </button>
      )}

    </div>


    {!editing ? (

      <div className="profile-content">

        <section className="profile-section">

          <div className="section-title">
            <h2>Personal Information</h2>
            <p>Your basic contact information</p>
          </div>

          <div className="profile-grid">

            <div className="profile-field">
              <label>Email</label>
              <p>{profile.email || 'Not provided'}</p>
            </div>

            <div className="profile-field">
              <label>Phone</label>
              <p>{profile.phone || 'Not provided'}</p>
            </div>

            <div className="profile-field full-width">
              <label>Address</label>
              <p>{profile.address || 'Not provided'}</p>
            </div>

          </div>

        </section>


        <section className="profile-section">

          <div className="section-title">
            <h2>Professional Information</h2>
            <p>Information that helps recruiters understand your experience</p>
          </div>

          <div className="profile-grid">

            <div className="profile-field">
              <label>Experience</label>
              <p>
                {profile.experienceYears || 0} year
                {Number(profile.experienceYears) === 1 ? '' : 's'}
              </p>
            </div>

            <div className="profile-field full-width">
              <label>Skills</label>

              <div className="skills-container">

                {profile.skills ? (

                  profile.skills
                    .split(',')
                    .map((skill, index) => (
                      <span
                        className="skill-tag"
                        key={index}
                      >
                        {skill.trim()}
                      </span>
                    ))

                ) : (

                  <p>Not provided</p>

                )}

              </div>

            </div>

          </div>

        </section>


        <section className="profile-section">

          <div className="section-title">
            <h2>Resume</h2>
            <p>Manage your resume for job applications</p>
          </div>

          <div className="resume-card">

            <div>
              <h3>My Resume</h3>
              <p>
                Upload and manage your resume from the Resume section.
              </p>
            </div>

            <Link
              to="/resume"
              className="resume-button"
            >
              Manage Resume
            </Link>

          </div>

        </section>

      </div>

    ) : (

      <form
        className="profile-edit-form"
        onSubmit={handleSubmit}
      >

        <div className="edit-header">

          <div>
            <h2>Edit Profile</h2>
            <p>Update your professional information</p>
          </div>

          <button
            type="button"
            className="cancel-button"
            onClick={() => {
              setEditing(false)
              loadProfile()
            }}
          >
            Cancel
          </button>

        </div>


        <div className="form-grid">

          <div className="form-group">

            <label>Name</label>

            <input
              type="text"
              name="name"
              value={profile.name || ''}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              value={profile.email || ''}
              readOnly
            />

            <small>Email cannot be changed</small>

          </div>


          <div className="form-group">

            <label>Phone</label>

            <input
              type="text"
              name="phone"
              value={profile.phone || ''}
              onChange={handleChange}
            />

          </div>


          <div className="form-group">

            <label>Experience (Years)</label>

            <input
              type="number"
              name="experienceYears"
              min="0"
              value={profile.experienceYears || 0}
              onChange={handleChange}
            />

          </div>


          <div className="form-group full-width">

            <label>Address</label>

            <textarea
              name="address"
              value={profile.address || ''}
              onChange={handleChange}
              rows="3"
            />

          </div>


          <div className="form-group full-width">

            <label>Skills</label>

            <textarea
              name="skills"
              value={profile.skills || ''}
              onChange={handleChange}
              placeholder="Java, Spring Boot, React, MySQL"
              rows="4"
            />

            <small>
              Separate multiple skills using commas
            </small>

          </div>

        </div>


        <div className="form-actions">

          <button
            type="button"
            className="cancel-button"
            onClick={() => {
              setEditing(false)
              loadProfile()
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-profile-button"
            disabled={saving}
          >
            {saving
              ? 'Updating...'
              : 'Save Changes'}
          </button>

        </div>

      </form>

    )}

  </div>

</div>


)
}

export default MyProfile
