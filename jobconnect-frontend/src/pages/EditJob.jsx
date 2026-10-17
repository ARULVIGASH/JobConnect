import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'

function EditJob() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    recruiterId: '',
    companyId: '',
    categoryId: '',
    title: '',
    description: '',
    skills: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    experience: '',
    jobType: 'FULL_TIME',
    workMode: 'ONSITE',
    vacancies: '',
    deadline: ''
  })

  useEffect(() => {
    loadJob()
  }, [id])

  const loadJob = async () => {

    try {

      const response = await api.get('/jobs/' + id)

      const job = response.data

      setFormData({
        recruiterId: job.recruiterId || '',
        companyId: job.companyId || '',
        categoryId: job.categoryId || '',
        title: job.title || '',
        description: job.description || '',
        skills: job.skills || '',
        location: job.location || '',
        salaryMin: job.salaryMin || '',
        salaryMax: job.salaryMax || '',
        experience: job.experience || '',
        jobType: job.jobType || 'FULL_TIME',
        workMode: job.workMode || 'ONSITE',
        vacancies: job.vacancies || '',
        deadline: job.deadline || ''
      })

    } catch (error) {

      console.error('Load job error:', error)

      alert(
        error.response?.data?.message ||
        'Unable to load job'
      )

      navigate('/recruiter/jobs')

    } finally {

      setLoading(false)

    }
  }

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      setSaving(true)

      const data = {
        recruiterId: Number(formData.recruiterId),
        companyId: Number(formData.companyId),
        categoryId: formData.categoryId
          ? Number(formData.categoryId)
          : null,

        title: formData.title,
        description: formData.description,
        skills: formData.skills,
        location: formData.location,

        salaryMin: Number(formData.salaryMin),
        salaryMax: Number(formData.salaryMax),

        experience: Number(formData.experience),

        jobType: formData.jobType,
        workMode: formData.workMode,

        vacancies: Number(formData.vacancies),

        deadline: formData.deadline
      }

      await api.put('/jobs/' + id, data)

      alert('Job updated successfully!')

      navigate('/recruiter/jobs')

    } catch (error) {

      console.error('Update job error:', error)

      alert(
        error.response?.data?.message ||
        'Failed to update job'
      )

    } finally {

      setSaving(false)

    }
  }

  if (loading) {
    return <h2>Loading job...</h2>
  }

  return (
    <div style={{ padding: '30px' }}>

      <h1>Edit Job</h1>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Job Title</label>
          <br />

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Description</label>
          <br />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>

        <br />

        <div>
          <label>Skills</label>
          <br />

          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Java, Spring Boot, React, MySQL"
          />
        </div>

        <br />

        <div>
          <label>Location</label>
          <br />

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Minimum Salary</label>
          <br />

          <input
            type="number"
            name="salaryMin"
            value={formData.salaryMin}
            onChange={handleChange}
            min="0"
          />
        </div>

        <br />

        <div>
          <label>Maximum Salary</label>
          <br />

          <input
            type="number"
            name="salaryMax"
            value={formData.salaryMax}
            onChange={handleChange}
            min="0"
          />
        </div>

        <br />

        <div>
          <label>Experience (Years)</label>
          <br />

          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            min="0"
          />
        </div>

        <br />

        <div>
          <label>Job Type</label>
          <br />

          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
          >
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
        </div>

        <br />

        <div>
          <label>Work Mode</label>
          <br />

          <select
            name="workMode"
            value={formData.workMode}
            onChange={handleChange}
          >
            <option value="ONSITE">Onsite</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>

        <br />

        <div>
          <label>Vacancies</label>
          <br />

          <input
            type="number"
            name="vacancies"
            value={formData.vacancies}
            onChange={handleChange}
            min="1"
          />
        </div>

        <br />

        <div>
          <label>Deadline</label>
          <br />

          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
          />
        </div>

        <br />

        <button
          type="submit"
          disabled={saving}
        >
          {saving ? 'Updating...' : 'Update Job'}
        </button>

        {' '}

        <button
          type="button"
          onClick={() => navigate('/recruiter/jobs')}
        >
          Cancel
        </button>

      </form>

    </div>
  )
}

export default EditJob