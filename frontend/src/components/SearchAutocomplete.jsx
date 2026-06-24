import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { searchCities } from '../services/weatherService';

export default function SearchAutocomplete({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await searchCities(query);
        setSuggestions(res.data.data || []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally { setSearching(false); }
    }, 400);
  }, [query]);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (city) => {
    setQuery(city.name);
    setShowSuggestions(false);
    onSearch(city.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) { onSearch(query.trim()); setShowSuggestions(false); }
  };

  const handleGPS = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(
      (pos) => onSearch(`${pos.coords.latitude},${pos.coords.longitude}`),
      () => alert('Could not get your location')
    );
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative', maxWidth: '580px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit} className="search-form" style={{ maxWidth: '100%' }}>
        <div className="search-input-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search city... e.g. Lahore"
            className="search-input"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setSuggestions([]); }}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button type="submit" disabled={loading} className="btn-search">
          {loading ? '...' : 'Search'}
        </button>
        <button type="button" onClick={handleGPS} className="btn-gps">
          <MapPin size={20} />
        </button>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && (suggestions.length > 0 || searching) && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          right: '110px',
          background: 'var(--bg2, #111827)',
          border: '1px solid var(--glass-border)',
          borderRadius: '16px',
          overflow: 'hidden',
          zIndex: 100,
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}>
          {searching ? (
            <div style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
              Searching...
            </div>
          ) : (
            suggestions.map((city) => (
              <button
                key={city.id}
                onClick={() => handleSelect(city)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid var(--glass-border)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: 'var(--text)',
                  fontFamily: 'Inter, sans-serif',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59,130,246,0.12)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                <MapPin size={16} color="#3b82f6" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{city.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {city.region && `${city.region}, `}{city.country}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}