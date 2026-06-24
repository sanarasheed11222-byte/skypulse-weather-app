import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

export default function SearchBar({ onSearch, loading }) {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) onSearch(city.trim());
  };

  const handleGPS = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(
      (pos) => onSearch(`${pos.coords.latitude},${pos.coords.longitude}`),
      () => alert('Could not get your location')
    );
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-input-wrap">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search city... e.g. Lahore"
          className="search-input"
        />
      </div>
      <button type="submit" disabled={loading} className="btn-search">
        {loading ? '...' : 'Search'}
      </button>
      <button type="button" onClick={handleGPS} className="btn-gps">
        <MapPin size={20} />
      </button>
    </form>
  );
}