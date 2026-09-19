import { Link } from 'react-router-dom'

function Home() {
  return (
    <main>
      <section className="home-hero">
        <div className="home-content">
          <p className="eyebrow">PADDLEMATCH</p>

          <h1>Find Your Perfect Paddle</h1>

          <p>
            Find a pickleball paddle that matches your
            skill level, playing style, and budget.
          </p>

          <Link to="/paddles" className="primary-button">
            Find My Paddle
          </Link>
        </div>

        <div className="home-image-placeholder">
          Paddle Image
        </div>
      </section>

      <section className="home-features">
        <h2>Designed for Beginners & Recreational Players</h2>

        <div className="feature-grid">
          <article className="feature-card">
            <h3>Paddle Match</h3>
            <p>
              Find paddle options based on your preferences.
            </p>
            <Link to="/paddles">Learn More →</Link>
          </article>

          <article className="feature-card">
            <h3>Player Match</h3>
            <p>
              Find players who are looking for someone to play with.
            </p>
            <Link to="/players">Learn More →</Link>
          </article>

          <article className="feature-card">
            <h3>Leaderboard</h3>
            <p>
              View player standings and points.
            </p>
            <Link to="/leaderboard">Learn More →</Link>
          </article>
        </div>
      </section>
    </main>
  )
}

export default Home
