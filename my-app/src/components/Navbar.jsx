import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaHeart } from 'react-icons/fa'
import logo from '../assets/logo4.png' // Import the logo image
import '../app.css'

function Navbar() {
  const isLoggedIn = !!localStorage.getItem('token')
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    navigate('/?logout=true')
  }

  const isActive = (path) => {
    return location.pathname === path ? 'navbar-button active' : 'navbar-button'
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src={logo} alt="ViteFait Logo" className="navbar-logo-image" />
      </Link>
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/about" className={isActive('/about')}>
            About Us
          </Link>
          <Link to="/contact" className={isActive('/contact')}>
            Contact
          </Link>
          {isLoggedIn && (
            <Link to="/favorites" className={isActive('/favorites')}>
              Favorites
            </Link>
          )}
        </div>
        <div className="navbar-right">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="navbar-button">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className={isActive('/login')}>Login</Link>
              <Link to="/signup" className={isActive('/signup')}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar