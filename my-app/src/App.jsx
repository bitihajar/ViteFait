import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './app.css';
import logo from './assets/logo.png';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [notification, setNotification] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Informatique');
  const [loadingPromotions, setLoadingPromotions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const categories = [
    'Informatique',
    'Téléphones',
    'TV & Électronique',
    'Mode',
    'Maison & Bureau',
    'Santé & Beauté',
    'Jeux & Consoles',
    'Supermarché',
    'Sport',
    'Bébé & Jouets'
  ];

  const userName = localStorage.getItem('name');
  const userEmail = localStorage.getItem('email');
  const isLoggedIn = !!localStorage.getItem('token');

  const showNotification = (message, onClose = () => setNotification(null)) => {
    setNotification({ message, onClose });
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setNotification(null);
      if (onClose) onClose();
    }, 1500);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const justLoggedIn = params.get('welcome');
    const justLoggedOut = params.get('logout');

    if (justLoggedIn && userName) {
      showNotification(`Hey ${userName}, welcome to ViteFait!`);
    }

    if (justLoggedOut) {
      showNotification('You have been logged out successfully!');
    }

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [location, userName]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await fetch(`/api/compare?product=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Failed to fetch results');
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      setError('Something went wrong while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPromotions = async (category) => {
    setLoadingPromotions(true);
    try {
      const res = await fetch(`/api/promotions?category=${encodeURIComponent(category)}`);
      const data = await res.json();
      setPromotions(data.products || []);
    } catch (err) {
      console.error('Failed to fetch promotions');
      showNotification('Failed to load promotions');
    } finally {
      setLoadingPromotions(false);
    }
  };

  useEffect(() => {
    fetchPromotions(selectedCategory);
  }, [selectedCategory]);

  const handleFavorite = async (item) => {
    if (!isLoggedIn) {
      showNotification('You need to log in to add favorites!', () => {
        navigate('/login');
      });
      return;
    }

    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, product: item })
      });

      const data = await res.json();
      if (data.message === 'Product already in favorites') {
        showNotification('This product is already in your favorites!');
      } else {
        showNotification(`${item.name} has been added to favorites!`);
      }
    } catch (err) {
      console.error('Failed to add favorite:', err);
      showNotification('Failed to add to favorites');
    }
  };

  const handleRemoveFavorite = async (item) => {
    if (!isLoggedIn) {
      showNotification('You need to log in to remove favorites!', () => {
        navigate('/login');
      });
      return;
    }

    try {
      const res = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, product: item })
      });

      const data = await res.json();
      if (data.message === 'Product removed from favorites') {
        showNotification(`${item.name} has been removed from favorites!`);
      } else {
        showNotification('Product was not found in your favorites.');
      }
    } catch (err) {
      console.error('Failed to remove favorite:', err);
      showNotification('Failed to remove from favorites');
    }
  };

  // Add keyboard scroll handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (scrollContainerRef.current) {
        const scrollAmount = 300; // Adjust this value to control scroll distance
        const container = scrollContainerRef.current;

        if (e.key === 'ArrowLeft') {
          container.scrollTo({
            left: container.scrollLeft - scrollAmount,
            behavior: 'smooth'
          });
        } else if (e.key === 'ArrowRight') {
          container.scrollTo({
            left: container.scrollLeft + scrollAmount,
            behavior: 'smooth'
          });
        }
      }
    };

    // Add keyboard event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array since we don't need to re-add the listener

  return (
    <div className="container">
      <div className="brand-header">
        <img src={logo} alt="ViteFait Logo" className="site-logo" />
        <form onSubmit={handleSearch} className="form-wrapper">
          <input
            type="text"
            placeholder="Search for a product..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-danger">{error}</p>}

      {results.length > 0 && (
        <div className="card-grid">
          {results.map((item, i) => (
            <div key={i} className="card">
              {item.image && (
                <img src={item.image} alt={item.name} />
              )}
              <div className="card-body">
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.name}
                </a>
                <p>{item.price}</p>
                <p className="source-tag">{item.source}</p>
                <button onClick={() => handleFavorite(item)}>Add to Favorites</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="promo-section mt-4">
        <div className="promo-header">
          <h3 className="section-title">🔥 Promotions</h3>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        {loadingPromotions ? (
          <p className="text-center">Loading promotions...</p>
        ) : (
          <div 
            className="promo-scroll-container" 
            ref={scrollContainerRef}
            tabIndex={0} // Make the container focusable for keyboard events
            aria-label="Product promotions carousel, use arrow keys to scroll"
          >
            <div className="promo-scroll">
              {/* First set of items */}
              <div className="promo-scroll-content">
                {promotions.map((item, i) => (
                  <div className="card promo-card" key={`original-${i}`}>
                    {item.image && (
                      <img src={item.image} alt={item.name} />
                    )}
                    <div className="card-body">
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        {item.name}
                      </a>
                      <p>{item.price}</p>
                      <p className="source-tag">{item.source}</p>
                      <button onClick={() => handleFavorite(item)}>Add to Favorites</button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Duplicate set of items */}
              <div className="promo-scroll-content">
                {promotions.map((item, i) => (
                  <div className="card promo-card" key={`duplicate-${i}`}>
                    {item.image && (
                      <img src={item.image} alt={item.name} />
                    )}
                    <div className="card-body">
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        {item.name}
                      </a>
                      <p>{item.price}</p>
                      <p className="source-tag">{item.source}</p>
                      <button onClick={() => handleFavorite(item)}>Add to Favorites</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notification Popup */}
      {notification && (
        <div className="notification-overlay">
          <div className="notification-popup">
            <p>{notification.message}</p>
            <button 
              onClick={() => {
                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current);
                }
                notification.onClose();
              }} 
              className="notification-button"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;