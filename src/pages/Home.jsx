import './Home.css'

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to MyApp</h1>
        <p>A modern web application built with React and Vite</p>
        <div className="hero-buttons">
          <button className="btn btn-primary btn-lg">Get Started</button>
          <button className="btn btn-outline-light btn-lg">Watch Demo</button>
          <button className="btn btn-secondary btn-lg">Learn More</button>
        </div>
      </section>

      <section className="features">
        <h2>Our Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Built with Vite for instant hot module replacement and blazing fast builds.</p>
            <button className="btn btn-feature">Explore</button>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Modern Design</h3>
            <p>Clean and responsive UI that looks great on all devices.</p>
            <button className="btn btn-feature">View Designs</button>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔧</div>
            <h3>Easy to Customize</h3>
            <p>Modular architecture makes it simple to add new features.</p>
            <button className="btn btn-feature">Customize</button>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of developers building amazing applications</p>
        <div className="cta-buttons">
          <button className="btn btn-primary btn-lg">Sign Up Free</button>
          <button className="btn btn-outline btn-lg">View Pricing</button>
          <button className="btn btn-ghost btn-lg">Contact Sales</button>
        </div>
      </section>

      <section className="stats">
        <div className="stat">
          <span className="stat-number">100+</span>
          <span className="stat-label">Happy Users</span>
          <button className="btn btn-stat">Join Now</button>
        </div>
        <div className="stat">
          <span className="stat-number">50+</span>
          <span className="stat-label">Projects</span>
          <button className="btn btn-stat">View All</button>
        </div>
        <div className="stat">
          <span className="stat-number">24/7</span>
          <span className="stat-label">Support</span>
          <button className="btn btn-stat">Get Help</button>
        </div>
      </section>
    </div>
  )
}

export default Home
