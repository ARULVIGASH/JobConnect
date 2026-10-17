import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function PostJob() {

  const navigate = useNavigate()

  const [recruiterId, setRecruiterId] = useState('')
  const [companies, setCompanies] = useState([])
  const [categories, setCategories] = useState([])

  const [formData, setFormData] = useState({
    companyId: '',
    categoryId: '',
    title: '',
    description: '',
    skills: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    experience: 0,
    jobType: 'FULL_TIME',
    workMode: 'ON_SITE',
    vacancies: 1,
    deadline: ''
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    loadRecruiter()
    loadCategories()
  }, [])


  // =========================
  // GET LOGGED-IN RECRUITER
  // =========================

  const loadRecruiter = async () => {

    try {

      const userId = localStorage.getItem('userId')
      const role = localStorage.getItem('role')
      const token = localStorage.getItem('token')

      console.log('User ID:', userId)
      console.log('Role:', role)
      console.log('Token exists:', !!token)

      if (!userId) {
        setError('Please login first')
        return
      }

      if (role !== 'RECRUITER') {
        setError('Please login as a recruiter')
        return
      }

      const response = await api.get(`/recruiters/user/${userId}`)

      console.log('Recruiter Response:', response.data)

      const id = response.data.id

      console.log('Recruiter ID:', id)

      setRecruiterId(id)

      // Load companies using recruiter ID
      await loadCompanies(id)

    } catch (error) {

      console.error('Recruiter error:', error)
      console.error('Status:', error.response?.status)
      console.error('Response:', error.response?.data)

      setError('Failed to load recruiter information')
    }
  }


  // =========================
  // GET COMPANIES
  // =========================

  const loadCompanies = async (id) => {

    try {

      console.log('Loading companies for Recruiter ID:', id)

      const response = await api.get(`/companies/recruiter/${id}`)

      console.log('Companies Response:', response.data)

      setCompanies(response.data)

      if (response.data.length === 0) {
        console.log('No companies found for recruiter:', id)
      }

    } catch (error) {

      console.error('Company error:', error)
      console.error('Status:', error.response?.status)
      console.error('Response:', error.response?.data)
      console.error('URL:', error.config?.url)

      setError('Failed to load companies')
    }
  }


  // =========================
  // GET CATEGORIES
  // =========================

  const loadCategories = async () => {

    try {

      const response = await api.get('/categories')

      console.log('Categories Response:', response.data)

      setCategories(response.data)

    } catch (error) {

      console.error('Category error:', error)
    }
  }


  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {

    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }


  // =========================
  // SUBMIT JOB
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault()

    setMessage('')
    setError('')

    try {

      const data = {
        recruiterId: Number(recruiterId),

        companyId: Number(formData.companyId),

        categoryId: formData.categoryId
          ? Number(formData.categoryId)
          : null,

        title: formData.title,

        description: formData.description,

        skills: formData.skills,

        location: formData.location,

        salaryMin: formData.salaryMin
          ? Number(formData.salaryMin)
          : null,

        salaryMax: formData.salaryMax
          ? Number(formData.salaryMax)
          : null,

        experience: Number(formData.experience),

        jobType: formData.jobType,

        workMode: formData.workMode,

        vacancies: Number(formData.vacancies),

        deadline: formData.deadline || null
      }

      console.log('Posting Job:', data)

      const response = await api.post('/jobs', data)

      console.log('Job Created:', response.data)

      setMessage('Job posted successfully! 🎉')

      setTimeout(() => {
        navigate('/recruiter/jobs')
      }, 1000)

    } catch (error) {

      console.error('Post job error:', error)
      console.error('Status:', error.response?.status)
      console.error('Response:', error.response?.data)

      setError(
        error.response?.data?.message ||
        'Failed to post job'
      )
    }
  }


  // =========================
  // UI
  // =========================

  return (

    <div
      style={{
        padding: '30px',
        maxWidth: '700px',
        margin: 'auto'
      }}
    >

      <h1>Post a New Job</h1>


      {message && (
        <p style={{ color: 'green' }}>
          {message}
        </p>
      )}


      {error && (
        <p style={{ color: 'red' }}>
          {error}
        </p>
      )}


      <form onSubmit={handleSubmit}>


        {/* COMPANY */}

        <label>Company</label>

        <select
          name="companyId"
          value={formData.companyId}
          onChange={handleChange}
          required
        >

          <option value="">
            Select Company
          </option>

          {companies.map((company) => (

            <option
              key={company.id}
              value={company.id}
            >
              {company.name}
            </option>

          ))}

        </select>


        <br />
        <br />


        {/* CATEGORY */}

        <label>Category</label>

        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
        >

          <option value="">
            Select Category
          </option>

          {categories.map((category) => (

            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>

          ))}

        </select>


        <br />
        <br />


        {/* JOB TITLE */}

        <label>Job Title</label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Example: Java Full Stack Developer"
          required
        />


        <br />
        <br />


        {/* DESCRIPTION */}

        <label>Description</label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter job description"
          rows="5"
          required
        />


        <br />
        <br />


        {/* SKILLS */}

        <label>Skills</label>

        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="Java, Spring Boot, React, MySQL"
        />


        <br />
        <br />


        {/* LOCATION */}

        <label>Location</label>

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Chennai"
        />


        <br />
        <br />


        {/* SALARY MIN */}

        <label>Minimum Salary</label>

        <input
          type="number"
          name="salaryMin"
          value={formData.salaryMin}
          onChange={handleChange}
          placeholder="30000"
        />


        <br />
        <br />


        {/* SALARY MAX */}

        <label>Maximum Salary</label>

        <input
          type="number"
          name="salaryMax"
          value={formData.salaryMax}
          onChange={handleChange}
          placeholder="60000"
        />


        <br />
        <br />


        {/* EXPERIENCE */}

        <label>Experience (Years)</label>

        <input
          type="number"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          min="0"
        />


        <br />
        <br />


        {/* JOB TYPE */}

        <label>Job Type</label>

        <select
          name="jobType"
          value={formData.jobType}
          onChange={handleChange}
        >

          <option value="FULL_TIME">
            Full Time
          </option>

          <option value="PART_TIME">
            Part Time
          </option>

          <option value="INTERNSHIP">
            Internship
          </option>

          <option value="CONTRACT">
            Contract
          </option>

          <option value="FREELANCE">
            Freelance
          </option>

        </select>


        <br />
        <br />


        {/* WORK MODE */}

        <label>Work Mode</label>

        <select
          name="workMode"
          value={formData.workMode}
          onChange={handleChange}
        >

          <option value="ON_SITE">
            On Site
          </option>

          <option value="REMOTE">
            Remote
          </option>

          <option value="HYBRID">
            Hybrid
          </option>

        </select>


        <br />
        <br />


        {/* VACANCIES */}

        <label>Number of Vacancies</label>

        <input
          type="number"
          name="vacancies"
          value={formData.vacancies}
          onChange={handleChange}
          min="1"
        />


        <br />
        <br />


        {/* DEADLINE */}

        <label>Application Deadline</label>

        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
        />


        <br />
        <br />


        <button type="submit">
          Post Job
        </button>

      </form>

    </div>
  )
}

export default PostJob