import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/weatherService';
import { useAuth } from '../context/AuthContext';
import { CloudSun } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const { data } = await loginUser(form);
      login(data); navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <CloudSun size={40} color="#3b82f6" />
          <div className="auth-title">Welcome back</div>
          <div className="auth-sub">Login to access your saved cities</div>
        </div>
        {error && <div className="error-box">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <input type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required className="auth-input" />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required className="auth-input" />
          <button type="submit" disabled={loading} className="auth-submit">{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <div className="auth-footer">Don't have an account? <Link to="/register" className="auth-link">Sign up free</Link></div>
      </div>
    </div>
  );
}