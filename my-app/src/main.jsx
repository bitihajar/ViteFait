import { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Favorites from './pages/Favorites'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import Navbar from './components/Navbar'

function Root() {
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Fake login state for now

  return (
    <BrowserRouter>
      <Navbar isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)
