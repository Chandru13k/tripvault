import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useToast } from '../components/Toast';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    username: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/auth/me');
        setFormData({
          username: res.data.user.username || '',
          bio: res.data.user.bio || ''
        });
      } catch (err) {
        setError('Failed to load profile data');
        showToast('Failed to load profile data', 'error');
      }
    };
    fetchProfile();
  }, [showToast]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.put('/api/users/profile', formData);
      
      // Update local storage user info
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setSuccess('Profile updated successfully!');
      showToast('Profile updated successfully!', 'success');
      
      // Navigate to profile page after short delay
      setTimeout(() => {
        navigate(`/profile/${res.data.user.username}`);
      }, 1200);
      
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update profile';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{
        background: 'var(--card-bg)',
        padding: '2.5rem',
        borderRadius: '15px',
        boxShadow: '0 8px 32px var(--shadow-color)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--border-color)',
      }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Edit Profile</h2>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. travel_lover_99"
              required
            />
            <small style={{ color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
              This will be your public handle for your profile URL.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="form-control"
              placeholder="Tell us about your travels..."
              rows="4"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', padding: '0.875rem', fontSize: '1.1rem', marginTop: '1rem' }}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary" 
            style={{ width: '100%', padding: '0.875rem', fontSize: '1.1rem' }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
