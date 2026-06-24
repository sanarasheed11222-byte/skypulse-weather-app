import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/weatherService';
import { useAuth } from '../context/AuthContext';
import { CloudSun } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const { data } = await registerUser(form);
      login(data); navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <CloudSun size={40} color="#3b82f6" />
          <div className="auth-title">Create account</div>
          <div className="auth-sub">Start saving your favourite cities</div>
        </div>
        {error && <div className="error-box">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <input type="text" placeholder="Full name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required className="auth-input" />
          <input type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required className="auth-input" />
          <input type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} minLength={6} required className="auth-input" />
          <button type="submit" disabled={loading} className="auth-submit">{loading ? 'Creating account...' : 'Sign Up'}</button>
        </form>
        <div className="auth-footer">Already have an account? <Link to="/login" className="auth-link">Login</Link></div>
      </div>
    </div>
  );
}