import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useToast } from '../components/Toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validations
    if (!name.trim() || !email.trim() || !password) {
      const errMsg = 'Please fill in all fields.';
      setError(errMsg);
      showToast(errMsg, 'error');
      return;
    }

    if (password.length < 6) {
      const errMsg = 'Password must be at least 6 characters long.';
      setError(errMsg);
      showToast(errMsg, 'error');
      return;
    }

    if (password !== confirmPassword) {
      const errMsg = 'Passwords do not match.';
      setError(errMsg);
      showToast(errMsg, 'error');
      return;
    }

    setLoading(true);

    try {
      await api.post('/api/auth/register', {
        name,
        email,
        password,
      });

      const successMsg = 'Account created successfully! Redirecting to login...';
      setSuccess(successMsg);
      showToast('Registration successful! Please log in.', 'success');
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      
      // Delay navigation so user can see success message
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || 'An error occurred during registration. Please try again.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      padding: '2rem 1rem'
    }}>
      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '2.5rem 2rem',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Create an Account
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Join TripVault and start logging your journeys.
        </p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              className="form-control"
              placeholder="John Doe"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              className="form-control"
              placeholder="john@example.com"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              className="form-control"
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              className="form-control"
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={{ color: 'var(--text-secondary)', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-secondary)', fontWeight: 600, textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
