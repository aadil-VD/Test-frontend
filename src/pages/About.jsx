import './About.css'

function About() {
  return (
    <div className="about">
      <section className="about-hero">
        <h1>About the Developer</h1>
        <p>Passionate about creating amazing web experiences</p>
        <div className="about-hero-buttons">
          <button className="btn btn-white">Download CV</button>
          <button className="btn btn-outline-white">Contact Me</button>
        </div>
      </section>

      <section className="developer-profile">
        <div className="profile-card">
          <div className="profile-avatar">
            <span>JD</span>
          </div>
          <h2>John Doe</h2>
          <p className="profile-title">Full Stack Developer</p>
          <p className="profile-bio">
            Hi there! I'm a passionate web developer with expertise in React, Node.js,
            and modern web technologies. I love building user-friendly applications
            that solve real-world problems.
          </p>
          <div className="profile-buttons">
            <button className="btn btn-primary">Hire Me</button>
            <button className="btn btn-outline">View Projects</button>
          </div>
          <div className="social-links">
            <button className="btn btn-social">GitHub</button>
            <button className="btn btn-social">LinkedIn</button>
            <button className="btn btn-social">Twitter</button>
          </div>
        </div>
      </section>

      <section className="skills-section">
        <h2>Skills & Technologies</h2>
        <div className="skills-grid">
          <div className="skill-item">
            <span className="skill-name">React</span>
            <div className="skill-bar">
              <div className="skill-progress" style={{ width: '90%' }}></div>
            </div>
          </div>
          <div className="skill-item">
            <span className="skill-name">JavaScript</span>
            <div className="skill-bar">
              <div className="skill-progress" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div className="skill-item">
            <span className="skill-name">CSS/SCSS</span>
            <div className="skill-bar">
              <div className="skill-progress" style={{ width: '80%' }}></div>
            </div>
          </div>
          <div className="skill-item">
            <span className="skill-name">Node.js</span>
            <div className="skill-bar">
              <div className="skill-progress" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
        <div className="skills-buttons">
          <button className="btn btn-primary">See All Skills</button>
          <button className="btn btn-secondary">View Certifications</button>
        </div>
      </section>

      <section className="experience-section">
        <h2>Experience</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h3>Senior Developer</h3>
              <span className="timeline-date">2022 - Present</span>
              <p>Leading frontend development for enterprise applications.</p>
              <button className="btn btn-timeline">View Details</button>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h3>Web Developer</h3>
              <span className="timeline-date">2020 - 2022</span>
              <p>Built responsive web applications using React and Vue.js.</p>
              <button className="btn btn-timeline">View Details</button>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h3>Junior Developer</h3>
              <span className="timeline-date">2018 - 2020</span>
              <p>Started my journey in web development with HTML, CSS, and JavaScript.</p>
              <button className="btn btn-timeline">View Details</button>
            </div>
          </div>
        </div>
        <div className="experience-buttons">
          <button className="btn btn-primary btn-lg">Download Full Resume</button>
          <button className="btn btn-outline btn-lg">Request Reference</button>
        </div>
      </section>

      <section className="contact-cta">
        <h2>Let's Work Together</h2>
        <p>Have a project in mind? Let's discuss how I can help bring your ideas to life.</p>
        <div className="contact-buttons">
          <button className="btn btn-white btn-lg">Send Message</button>
          <button className="btn btn-outline-white btn-lg">Schedule Call</button>
          <button className="btn btn-ghost-white btn-lg">View Portfolio</button>
        </div>
      </section>
    </div>
  )
}

export default About
