import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>MyApp</h3>
          <p>Building amazing web experiences with modern technologies.</p>
          <div className="footer-buttons">
            <button className="btn btn-primary">Get Started</button>
            <button className="btn btn-outline">Learn More</button>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <nav className="footer-nav">
            <Link to="/">Home</Link>
            <Link to="/about">Aboutssss</Link>
          </nav>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>email@example.com</p>
          <p>+1 234 567 890</p>
          <button className="btn btn-secondary">Contact Us</button>
        </div>

        <div className="footer-section">
          <h4>Newsletter</h4>
          <p>Subscribe for updates</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button className="btn btn-primary">Subscribe</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 MyApp. All rights reserved.</p>
        <div className="footer-bottom-buttons">
          <button className="btn btn-text">Privacy Policy</button>
          <button className="btn btn-text">Terms of Service</button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
