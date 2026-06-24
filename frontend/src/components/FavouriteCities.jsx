import { Star, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { removeFavourite } from '../services/weatherService';

export default function FavouriteCities({ onSelect }) {
  const { user, updateFavourites } = useAuth();
  if (!user || !user.favourites?.length) return null;

  const handleRemove = async (city, e) => {
    e.stopPropagation();
    const res = await removeFavourite(city);
    updateFavourites(res.data.favourites);
  };

  return (
    <div className="fav-card">
      <div className="fav-title">
        <Star size={16} color="#facc15" fill="#facc15" /> Saved Cities
      </div>
      <div className="fav-chips">
        {user.favourites.map((city) => (
          <button key={city} onClick={() => onSelect(city)} className="fav-chip">
            {city}
            <span className="fav-remove" onClick={(e) => handleRemove(city, e)}><X size={14} /></span>
          </button>
        ))}
      </div>
    </div>
  );
}