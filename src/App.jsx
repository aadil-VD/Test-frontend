import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Thoughts from './pages/Thoughts'
import './App.css'
//sfdsdfsdfsdfsdfsdfsdaf
function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/thoughts" element={<Thoughts />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
