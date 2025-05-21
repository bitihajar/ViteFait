import { useEffect, useState } from 'react';


function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [notification, setNotification] = useState(null);
  const email = localStorage.getItem('email');

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await fetch(`/api/favorites?email=${email}`);
        if (!res.ok) throw new Error('Failed to fetch favorites');
        const data = await res.json();
        setFavorites(data || []);
      } catch (err) {
        console.error('Error loading favorites:', err);
      }
    }

    if (email) fetchFavorites();
  }, [email]);

  const showNotification = (message) => {
    setNotification({ message });
    setTimeout(() => {
      setNotification(null);
    }, 1500);
  };

  const handleAddFavorite = async (product) => {
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, product }),
      });

      if (!res.ok) throw new Error('Failed to add favorite');

      const data = await res.json();
      if (data.message === 'Product already in favorites') {
        alert('This product is already in your favorites!');
      } else {
        alert('Added to favorites!');
        const newFavs = await fetch(`/api/favorites?email=${email}`);
        setFavorites(await newFavs.json());
      }
    } catch (err) {
      console.error('Failed to add favorite:', err);
      alert(err.message);
    }
  };

  const handleRemove = async (product) => {
    try {
      const res = await fetch('/api/favorites/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, product }),
      });

      if (!res.ok) throw new Error('Failed to remove favorite');

      setFavorites(favorites.filter((f) => f.name !== product.name));
      showNotification('Removed from favorites!');
    } catch (err) {
      console.error('Failed to remove favorite:', err);
      showNotification(err.message);
    }
  };

  return (
    <div className="container">
      <h2 className="brand-header">Your Favorites</h2>

      {favorites.length === 0 ? (
        <p className="text-center">No favorite products yet.</p>
      ) : (
        <div className="card-grid">
          {favorites.map((product, idx) => (
            <div className="card" key={idx}>
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                  style={{ height: '200px', objectFit: 'contain', background: '#fff' }}
                />
              )}
              <div className="card-body">
                <a href={product.link} target="_blank" rel="noopener noreferrer">
                  {product.name}
                </a>
                <p>{product.price}</p>
                <p className="source-tag">{product.source}</p>
                <button onClick={() => handleRemove(product)}>
                  Remove from Favorites
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notification Popup */}
      {notification && (
        <div className="notification-overlay">
          <div className="notification-popup">
            <p>{notification.message}</p>
            <button 
              onClick={() => setNotification(null)} 
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

export default Favorites;
