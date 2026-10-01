import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, FileText, ArrowLeft, Loader2, ExternalLink, CheckCircle2 } from 'lucide-react';
import api from '../api';
import { useToast } from '../components/Toast';

const EditProfile = ({ setUser }) => {
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
          bio: res.data.user.bio || '',
        });
      } catch (err) {
        setError('Failed to load profile data');
        showToast('Failed to load profile data', 'error');
      } finally {
        setFetching(false);
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
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (setUser) setUser(res.data.user);

      setSuccess('Profile updated successfully!');
      showToast('Profile updated successfully!', 'success');

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

  if (fetching) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '0 1.5rem', flex: 1 }}>
        <div className="glass-panel shimmer" style={{ height: '380px', borderRadius: 'var(--radius-lg)' }} />
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '640px',
        margin: '0 auto',
        padding: '2.5rem 1.5rem',
        width: '100%',
        flex: 1,
      }}
      className="animate-fade-in"
    >
      <button
        onClick={() => navigate('/dashboard')}
        className="btn-glass"
        style={{ marginBottom: '1.75rem', fontSize: '0.9rem' }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div
        className="glass-panel"
        style={{
          padding: '2.5rem',
          background: 'rgba(15, 23, 42, 0.85)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            Edit Traveler Profile
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Update your public handle and traveler bio.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '0.875rem 1rem',
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

        {success && (
          <div
            style={{
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#6ee7b7',
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <CheckCircle2 size={18} /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <User size={16} color="var(--accent-primary)" /> Username Handle
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g. wanderlust_journal"
              className="input-premium"
              required
            />
            {formData.username && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>Public Profile Link:</span>
                <Link to={`/profile/${formData.username}`} style={{ color: 'var(--accent-cyan)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  /profile/{formData.username} <ExternalLink size={12} />
                </Link>
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <FileText size={16} color="var(--accent-secondary)" /> Traveler Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Share your wanderlust philosophy, favorite regions, or upcoming expeditions..."
              className="input-premium"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-glass"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-premium"
              style={{ flex: 1.5, justifyContent: 'center' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Saving...
                </>
              ) : (
                'Save Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
