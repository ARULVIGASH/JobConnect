import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../services/api'

function Jobs() {

const [searchParams] = useSearchParams()

const [jobs, setJobs] = useState([])
const [filteredJobs, setFilteredJobs] = useState([])
const [categories, setCategories] = useState([])

const [loading, setLoading] = useState(true)

const [search, setSearch] = useState('')
const [location, setLocation] = useState('')
const [jobType, setJobType] = useState('')
const [workMode, setWorkMode] = useState('')
const [category, setCategory] = useState('')
const [minSalary, setMinSalary] = useState('')
const [maxSalary, setMaxSalary] = useState('')

useEffect(() => {
    const homeTitle = searchParams.get('title') || ''
    const homeLocation = searchParams.get('location') || ''

    setSearch(homeTitle)
    setLocation(homeLocation)

    fetchJobs()
    fetchCategories()
}, [searchParams])

async function fetchJobs() {

    try {

        const response = await api.get('/jobs')

        console.log('Jobs from backend:', response.data)

        setJobs(response.data)

        const homeTitle = searchParams.get('title') || ''
        const homeLocation = searchParams.get('location') || ''

        let results = response.data

        if (homeTitle.trim() !== '') {
            const titleText = homeTitle.toLowerCase()

            results = results.filter((job) =>
                (job.title || '')
                    .toLowerCase()
                    .includes(titleText)
            )
        }

        if (homeLocation.trim() !== '') {
            const locationText = homeLocation.toLowerCase()

            results = results.filter((job) =>
                (job.location || '')
                    .toLowerCase()
                    .includes(locationText)
            )
        }

        setFilteredJobs(results)

    } catch (error) {

        console.error('Error fetching jobs:', error)

    } finally {

        setLoading(false)

    }
}

async function fetchCategories() {

    try {

        const response = await api.get('/categories')

        console.log('Categories from backend:', response.data)

        setCategories(response.data)

    } catch (error) {

        console.error('Error fetching categories:', error)

    }
}

async function handleSearch() {

    try {

        setLoading(true)

        let results = jobs

        if (search.trim() !== '') {

            const searchText = search.trim().toLowerCase()

            results = results.filter((job) =>
                (job.title || '')
                    .toLowerCase()
                    .includes(searchText)
            )
        }

        if (category !== '') {

            const response = await api.get(
                `/jobs/search/category?categoryId=${category}`
            )

            const categoryIds = response.data.map(
                (job) => job.id
            )

            results = results.filter(
                (job) => categoryIds.includes(job.id)
            )
        }

        if (location.trim() !== '') {

            const locationText = location.toLowerCase()

            results = results.filter((job) =>
                (job.location || '')
                    .toLowerCase()
                    .includes(locationText)
            )
        }

        if (jobType !== '') {

            results = results.filter(
                (job) => job.jobType === jobType
            )
        }

        if (workMode !== '') {

            results = results.filter(
                (job) => job.workMode === workMode
            )
        }

        if (minSalary !== '') {

            const minimum = Number(minSalary)

            results = results.filter(
                (job) =>
                    Number(job.salaryMax || 0) >= minimum
            )
        }

        if (maxSalary !== '') {

            const maximum = Number(maxSalary)

            results = results.filter(
                (job) =>
                    Number(job.salaryMin || 0) <= maximum
            )
        }

        setFilteredJobs(results)

    } catch (error) {

        console.error('Error searching jobs:', error)

        setFilteredJobs([])

    } finally {

        setLoading(false)

    }
}

function clearFilters() {

    setSearch('')
    setLocation('')
    setJobType('')
    setWorkMode('')
    setCategory('')
    setMinSalary('')
    setMaxSalary('')

    setFilteredJobs(jobs)
}

if (loading) {
    return <h3>Loading jobs...</h3>
}

return (
    <div style={styles.page}>

        <h1 style={styles.title}>
            Available Jobs
        </h1>

        <p style={styles.subtitle}>
            Find the right job opportunity for you.
        </p>

        <div style={styles.filterBox}>

            <div style={styles.inputGroup}>

                <label>Search</label>

                <input
                    type="text"
                    placeholder="Job title"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>

            <div style={styles.inputGroup}>

                <label>Location</label>

                <input
                    type="text"
                    placeholder="Chennai"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />

            </div>

            <div style={styles.inputGroup}>

                <label>Category</label>

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >

                    <option value="">
                        All Categories
                    </option>

                    {categories.map((cat) => (

                        <option
                            key={cat.id}
                            value={cat.id}
                        >
                            {cat.name}
                        </option>

                    ))}

                </select>

            </div>

            <div style={styles.inputGroup}>

                <label>Job Type</label>

                <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                >

                    <option value="">
                        All Types
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

            <div style={styles.inputGroup}>

                <label>Work Mode</label>

                <select
                    value={workMode}
                    onChange={(e) => setWorkMode(e.target.value)}
                >

                    <option value="">
                        All Modes
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

            <div style={styles.inputGroup}>

                <label>Min Salary</label>

                <input
                    type="number"
                    placeholder="30000"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                />

            </div>

            <div style={styles.inputGroup}>

                <label>Max Salary</label>

                <input
                    type="number"
                    placeholder="60000"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value)}
                />

            </div>

            <div style={styles.buttonGroup}>

                <button
                    onClick={handleSearch}
                    style={styles.searchButton}
                >
                    Search
                </button>

                <button
                    onClick={clearFilters}
                    style={styles.clearButton}
                >
                    Clear
                </button>

            </div>

        </div>

        <p style={styles.resultCount}>
            {filteredJobs.length} job(s) found
        </p>

        {filteredJobs.length === 0 ? (

            <div style={styles.noJobs}>

                <h3>No jobs found</h3>

                <p>
                    Try changing your search or filters.
                </p>

            </div>

        ) : (

            <div style={styles.jobContainer}>

                {filteredJobs.map((job) => (

                    <div
                        key={job.id}
                        style={styles.jobCard}
                    >

                        <Link
                            to={`/jobs/${job.id}`}
                            style={styles.jobTitle}
                        >
                            {job.title}
                        </Link>

                        <p>
                            <strong>Company:</strong>{' '}
                            {job.companyName || 'N/A'}
                        </p>

                        <p>
                            <strong>Location:</strong>{' '}
                            {job.location || 'N/A'}
                        </p>

                        <p>
                            <strong>Category:</strong>{' '}
                            {job.categoryName || 'N/A'}
                        </p>

                        <p>
                            <strong>Salary:</strong>{' '}
                            ₹{job.salaryMin || 0} - ₹{job.salaryMax || 0}
                        </p>

                        <p>
                            <strong>Job Type:</strong>{' '}
                            {job.jobType || 'N/A'}
                        </p>

                        <p>
                            <strong>Work Mode:</strong>{' '}
                            {job.workMode || 'N/A'}
                        </p>

                        <p>
                            <strong>Skills:</strong>{' '}
                            {job.skills || 'N/A'}
                        </p>

                        <Link
                            to={`/jobs/${job.id}`}
                            style={styles.viewButton}
                        >
                            View Job →
                        </Link>

                    </div>

                ))}

            </div>

        )}

    </div>
)

}

const styles = {

page: {
    padding: '40px',
    maxWidth: '1100px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '80vh'
},

title: {
    margin: '0',
    color: '#0f172a',
    fontSize: '32px'
},

subtitle: {
    color: '#64748b',
    marginBottom: '30px'
},

filterBox: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 1.2fr 1fr 1fr',
    gap: '15px',
    alignItems: 'end'
},

inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px'
},

buttonGroup: {
    display: 'flex',
    gap: '8px'
},

searchButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '7px',
    cursor: 'pointer',
    fontWeight: 'bold'
},

clearButton: {
    backgroundColor: '#e2e8f0',
    color: '#334155',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '7px',
    cursor: 'pointer'
},

resultCount: {
    marginTop: '25px',
    color: '#64748b',
    fontWeight: 'bold'
},

jobContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
},

jobCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
},

jobTitle: {
    display: 'block',
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#2563eb',
    textDecoration: 'none',
    marginBottom: '15px'
},

viewButton: {
    display: 'inline-block',
    marginTop: '10px',
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    padding: '9px 15px',
    borderRadius: '7px',
    textDecoration: 'none',
    fontWeight: 'bold'
},

noJobs: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid #e2e8f0'
}

}

export default Jobs