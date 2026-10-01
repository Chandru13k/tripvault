import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Compass, Loader2, ArrowLeft } from 'lucide-react';
import api from '../api';
import { useToast } from '../components/Toast';
import { AUTH_BG_LOGIN } from '../config/images';

const Login = ({ setToken, setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      const errMsg = 'Please enter both email address and password.';
      setError(errMsg);
      showToast(errMsg, 'error');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      if (setToken) setToken(res.data.token);
      if (setUser) setUser(res.data.user);

      showToast(`Welcome back, ${res.data.user.name}!`, 'success');
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        flex: 1,
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
      }}
      className="animate-fade-in auth-split-layout"
    >
      {/* Left Column: Photography Banner */}
      <div
        style={{
          position: 'relative',
          backgroundImage: `url(${AUTH_BG_LOGIN})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '3rem 2.5rem',
          minHeight: '400px',
        }}
        className="auth-image-col"
      >
        <div className="photo-overlay-bottom" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
        
        <Link to="/" style={{ position: 'relative', zIndex: 2, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '0.9rem', fontFamily: 'var(--font-label)', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Explore
        </Link>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="travel-badge" style={{ marginBottom: '1rem' }}>
            Traveler Access
          </span>
          <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '2.5rem', color: '#ffffff', lineHeight: 1.15, marginBottom: '0.75rem' }}>
            "To travel is to live twice."
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem' }}>
            Access your personal travel journal, photographs, and destination logs.
          </p>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '3rem 2rem',
          background: 'var(--bg-main)',
        }}
      >
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '2.25rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '1px solid var(--accent-terracotta)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                background: 'rgba(217, 107, 67, 0.12)',
              }}
            >
              <Compass size={22} color="var(--accent-terracotta)" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-editorial)', fontSize: '2.2rem', color: '#ffffff', marginBottom: '0.35rem' }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Sign in to unlock your personal travel journal.
            </p>
          </div>

          {error && (
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                fontSize: '0.9rem',
                marginBottom: '1.5rem',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: 'var(--font-label)' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--text-subtle)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="traveler@domain.com"
                  className="input-editorial"
                  style={{ paddingLeft: '42px' }}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: 'var(--font-label)' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--text-subtle)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="••••••••"
                  className="input-editorial"
                  style={{ paddingLeft: '42px', paddingRight: '42px' }}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-cinematic"
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.9rem' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Authenticating...
                </>
              ) : (
                <>
                  <LogIn size={18} /> Sign In to Journal
                </>
              )}
            </button>
          </form>

          <p style={{ color: 'var(--text-muted)', marginTop: '2rem', fontSize: '0.9rem', textAlign: 'center' }}>
            Don't have a travel journal yet?{' '}
            <Link to="/register" style={{ color: 'var(--accent-terracotta)', fontWeight: 700 }}>
              Create One Free
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .auth-split-layout { grid-template-columns: 1fr !important; }
          .auth-image-col { min-height: 240px !important; padding: 2rem 1.5rem !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;
