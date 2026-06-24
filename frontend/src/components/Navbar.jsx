import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, CloudSun, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <CloudSun size={26} />
        SkyPulse
      </Link>
      <div className="navbar-links">
        <button onClick={toggle} className="btn-icon">
          {dark ? <Sun size={20} color="#facc15" /> : <Moon size={20} />}
        </button>
        {user ? (
          <>
            <Link to="/dashboard" className="user-label">
              <User size={16} /> {user.name}
            </Link>
            <button onClick={handleLogout} className="btn-danger">
              <LogOut size={15} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-ghost">Login</Link>
            <Link to="/register" className="btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}