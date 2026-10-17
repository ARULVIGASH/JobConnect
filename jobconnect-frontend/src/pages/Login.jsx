import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Login() {

const navigate = useNavigate()

const [formData, setFormData] = useState({
email: '',
password: ''
})

const [loading, setLoading] = useState(false)

const handleChange = (e) => {


setFormData({
  ...formData,
  [e.target.name]: e.target.value
})


}

const handleSubmit = async (e) => {

e.preventDefault()

try {

  setLoading(true)

  const response = await api.post(
    '/auth/login',
    formData
  )

  const data = response.data

  console.log('Login response:', data)

  localStorage.setItem('token', data.token)
  localStorage.setItem('userId', data.userId)
  localStorage.setItem('role', data.role)
  localStorage.setItem('email', data.email)

  if (data.role === 'RECRUITER') {

    try {

      const recruiterResponse =
        await api.get(
          '/recruiters/user/' + data.userId
        )

      const recruiter = recruiterResponse.data

      console.log(
        'Recruiter details:',
        recruiter
      )

      localStorage.setItem(
        'recruiterId',
        recruiter.id
      )

    } catch (recruiterError) {

      console.error(
        'Recruiter details error:',
        recruiterError
      )

      alert(
        'Login successful, but recruiter information could not be loaded.'
      )

      return
    }

    alert('Login successful!')

    navigate('/recruiter/dashboard')

  }

  else if (data.role === 'JOB_SEEKER') {

    alert('Login successful!')

    navigate('/jobs')

  }

  else if (data.role === 'ADMIN') {

    alert('Login successful!')

    navigate('/admin')

  }

  else {

    alert('Login successful!')

    navigate('/')

  }

} catch (error) {

  console.error('Login error:', error)

  let errorMessage = 'Login failed'

  if (error.response) {

    const status = error.response.status

    const backendMessage =
      error.response.data?.message

    if (
      status === 401 ||
      status === 403
    ) {

      errorMessage =
        'Incorrect email or password'

    }

    else if (backendMessage) {

      errorMessage =
        backendMessage

    }

  }

  else if (error.request) {

    errorMessage =
      'Unable to connect to server'

  }

  alert(errorMessage)

} finally {

  setLoading(false)

}


}

return (

<div>

  <h1>Login</h1>

  <form onSubmit={handleSubmit}>

    <div>

      <label>
        Email
      </label>

      <br />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

    </div>

    <br />

    <div>

      <label>
        Password
      </label>

      <br />

      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />

    </div>

    <br />

    <button
      type="submit"
      disabled={loading}
    >

      {loading
        ? 'Logging in...'
        : 'Login'}

    </button>

  </form>

</div>

)

}

export default Login
