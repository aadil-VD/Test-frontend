import './Thoughts.css'

function Thoughts() {
  const thoughts = [
    {
      id: 1,
      title: "The Power of Consistency",
      date: "December 28, 2025",
      content: "Small, consistent actions compound over time. Whether it's learning a new skill, building a habit, or working on a project, showing up every day matters more than occasional bursts of intense effort. The key is not to be perfect, but to be persistent."
    },
    {
      id: 2,
      title: "Embracing Change",
      date: "December 25, 2025",
      content: "Change is the only constant in life. Instead of resisting it, we should learn to dance with it. Every change brings new opportunities, new lessons, and new perspectives. The question is not whether change will come, but how we'll respond when it does."
    },
    {
      id: 3,
      title: "The Art of Simplicity",
      date: "December 20, 2025",
      content: "In a world that constantly pushes us to do more, have more, and be more, there's profound wisdom in simplicity. Simplifying our lives—our schedules, our possessions, our goals—creates space for what truly matters. Less is often more."
    },
    {
      id: 4,
      title: "Learning in Public",
      date: "December 15, 2025",
      content: "Sharing our learning journey, including our mistakes and failures, is one of the most powerful ways to grow. It keeps us accountable, helps others who are on similar paths, and creates unexpected opportunities for connection and collaboration."
    },
    {
      id: 5,
      title: "The Value of Deep Work",
      date: "December 10, 2025",
      content: "In an age of constant notifications and distractions, the ability to focus deeply on a single task has become a superpower. Deep work produces better results, faster learning, and greater satisfaction than scattered, shallow efforts ever could."
    }
  ]

  return (
    <div className="thoughts-page">
      <div className="thoughts-container">
        <div className="thoughts-header">
          <h1>My Thoughts</h1>
          <p className="thoughts-subtitle">
            Reflections on life, learning, and everything in between
          </p>
        </div>

        <div className="thoughts-grid">
          {thoughts.map((thought) => (
            <article key={thought.id} className="thought-card">
              <div className="thought-header">
                <h2>{thought.title}</h2>
                <span className="thought-date">{thought.date}</span>
              </div>
              <p className="thought-content">{thought.content}</p>
              <div className="thought-footer">
                <button className="read-more-btn">Read More</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Thoughts
