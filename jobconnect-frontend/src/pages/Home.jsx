import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')

  const role = localStorage.getItem('role')

  const handleSearch = (event) => {
    event.preventDefault()

    const searchParams = new URLSearchParams()

    if (title.trim()) {
      searchParams.set('title', title.trim())
    }

    if (location.trim()) {
      searchParams.set('location', location.trim())
    }

    const query = searchParams.toString()
    navigate(query ? `/jobs?${query}` : '/jobs')
  }

  const categories = [
    { icon: '💻', name: 'Software Development', description: 'Build applications and digital products' },
    { icon: '📊', name: 'Data & Analytics', description: 'Turn data into useful insights' },
    { icon: '🎨', name: 'UI / UX Design', description: 'Create meaningful user experiences' },
    { icon: '📱', name: 'Mobile Development', description: 'Build apps for mobile devices' },
    { icon: '☁️', name: 'Cloud & DevOps', description: 'Build and manage cloud infrastructure' },
    { icon: '🔐', name: 'Cybersecurity', description: 'Help protect systems and data' },
  ]

  return (
    <main className="home-page">

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">
            YOUR CAREER JOURNEY STARTS HERE
          </span>

          <h1>
            Find work that
            <span> moves you forward.</span>
          </h1>

          <p className="hero-description">
            Explore opportunities, discover companies, and find a role
            that matches your skills and ambitions.
          </p>

          <form className="search-box" onSubmit={handleSearch}>
            <label className="search-field">
              <span>Job title or skill</span>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Java Developer"
              />
            </label>

            <label className="search-field">
              <span>Location</span>
              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="e.g. Chennai"
              />
            </label>

            <button type="submit" className="search-button">
              Search jobs
              <span aria-hidden="true"> →</span>
            </button>
          </form>

          <p className="popular-text">
            Explore roles in Java, React, software engineering and more.
          </p>
        </div>

        <div className="hero-decoration" aria-hidden="true">
          <div className="decoration-card decoration-card-top">
            <span className="decoration-icon">✦</span>
            <div>
              <strong>Your next chapter</strong>
              <small>Starts with one search</small>
            </div>
          </div>

          <div className="decoration-card decoration-card-bottom">
            <span className="decoration-check">✓</span>
            <div>
              <strong>Find your fit</strong>
              <small>Discover new opportunities</small>
            </div>
          </div>

          <div className="hero-orb">
            <span>JC</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories section-container">
        <div className="section-heading">
          <span className="section-eyebrow">EXPLORE CAREER PATHS</span>
          <h2>Discover opportunities by field</h2>
          <p>
            Start with an area that interests you and explore your next move.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <button
              type="button"
              className="category-card"
              key={category.name}
              onClick={() => {
                setTitle(category.name)
                navigate(`/jobs?${new URLSearchParams({
                  title: category.name,
                }).toString()}`)
              }}
            >
              <span className="category-icon">{category.icon}</span>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <span className="category-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="why-section">
        <div className="section-container">
          <div className="section-heading">
            <span className="section-eyebrow">THE JOBCONNECT EXPERIENCE</span>
            <h2>A simpler way to move your career forward</h2>
            <p>
              Keep your job search and application journey organized in one place.
            </p>
          </div>

          <div className="features">
            <article className="feature-card">
              <span className="feature-number">01</span>
              <div className="feature-icon">⌕</div>
              <h3>Explore opportunities</h3>
              <p>
                Search for roles by job title, skills, and location.
              </p>
            </article>

            <article className="feature-card">
              <span className="feature-number">02</span>
              <div className="feature-icon">▤</div>
              <h3>Manage applications</h3>
              <p>
                Keep track of the jobs you apply for through your account.
              </p>
            </article>

            <article className="feature-card">
              <span className="feature-number">03</span>
              <div className="feature-icon">♧</div>
              <h3>Stay informed</h3>
              <p>
                Check your notifications for important application updates.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Recruiter call-to-action: recruiters only */}
      {role === 'RECRUITER' && (
        <section className="recruiter-section">
          <div className="recruiter-content">
            <span className="section-eyebrow">FOR RECRUITERS</span>
            <h2>Meet the people who can move your business forward.</h2>
            <p>
              Publish opportunities, manage applications, and connect
              with professionals through JobConnect.
            </p>
            <Link to="/recruiter/post-job" className="recruiter-button">
              Post a job <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="recruiter-mark" aria-hidden="true">JC</div>
        </section>
      )}

      {/* General call-to-action */}
      <section className="cta">
        <span className="section-eyebrow">YOUR NEXT STEP</span>
        <h2>There's a new opportunity waiting for you.</h2>
        <p>Take a look at the roles available on JobConnect.</p>
        <Link to="/jobs" className="cta-button">
          Explore jobs <span aria-hidden="true">→</span>
        </Link>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-mark">J</span>
              JobConnect
            </Link>
            <p>
              Connecting people with opportunities to grow.
            </p>
          </div>

          <div className="footer-links">
            <h3>Explore</h3>
            <Link to="/jobs">Find jobs</Link>
            {role === 'JOB_SEEKER' && (
              <Link to="/my-applications">My applications</Link>
            )}
          </div>

          <div className="footer-links">
            <h3>Account</h3>
            {!role ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Create an account</Link>
              </>
            ) : (
              <Link to="/notifications">Notifications</Link>
            )}
          </div>

          {role === 'RECRUITER' && (
            <div className="footer-links">
              <h3>Recruiter</h3>
              <Link to="/recruiter/post-job">Post a job</Link>
              <Link to="/recruiter/dashboard">Recruiter dashboard</Link>
            </div>
          )}

          {role === 'ADMIN' && (
            <div className="footer-links">
              <h3>Administration</h3>
              <Link to="/admin/dashboard">Admin dashboard</Link>
            </div>
          )}
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} JobConnect</span>
          <span>Built to connect talent with opportunity.</span>
        </div>
      </footer>

    </main>
  )
}

export default Home

