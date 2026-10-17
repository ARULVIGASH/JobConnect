import { useState } from 'react'
import api from '../services/api'

function Register() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'JOB_SEEKER'
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      const response = await api.post('/auth/register', formData)

      alert(response.data.message || 'Registration successful!')

    } catch (error) {

      console.error(error)

      alert(
        error.response?.data?.message ||
        'Registration failed'
      )
    }
  }

  return (
    <div>

      <h2>Create JobConnect Account</h2>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Name</label>
          <br />
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Phone</label>
          <br />
          <input
            type="text"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Role</label>
          <br />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="JOB_SEEKER">
              Job Seeker
            </option>

            <option value="RECRUITER">
              Recruiter
            </option>
          </select>
        </div>

        <br />

        <button type="submit">
          Register
        </button>

      </form>

    </div>
  )
}

export default Register