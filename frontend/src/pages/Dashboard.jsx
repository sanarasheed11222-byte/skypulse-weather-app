import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Star, User, MapPin } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (!user) navigate('/login'); }, [user, navigate]);
  if (!user) return null;

  return (
    <main className="main">
      <div className="dashboard-card">
        <div className="profile-section">
          <div className="profile-avatar"><User size={30} /></div>
          <div>
            <div className="profile-name">{user.name}</div>
            <div className="profile-email">{user.email}</div>
          </div>
        </div>
        <div>
          <div className="fav-title" style={{marginBottom: '16px'}}>
            <Star size={18} color="#facc15" fill="#facc15" /> Saved Cities
          </div>
          {user.favourites?.length ? (
            <div className="city-grid">
              {user.favourites.map((city) => (
                <button key={city} onClick={() => navigate('/')} className="city-btn">
                  <MapPin size={14} /> {city}
                </button>
              ))}
            </div>
          ) : (
            <p style={{color:'#94a3b8'}}>No saved cities yet. Search a city and click ♥ to save it.</p>
          )}
        </div>
      </div>
    </main>
  );
}