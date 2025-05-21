import { useState } from 'react';
import './app.css';


export default function MainPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div className="centered-container">
      <h1 className="brand-title">ViteFait</h1>

      <form onSubmit={handleSearch} style={{ width: '100%', maxWidth: '500px' }}>
        <input
          type="text"
          placeholder="Search for a product..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ width: '100%', maxWidth: '500px', marginTop: '1rem' }}>
        {results.map((item, i) => (
          <li key={i} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="result-link">
              {item.name}
            </a>
            <p>{item.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
