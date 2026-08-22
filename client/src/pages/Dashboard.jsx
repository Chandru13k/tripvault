import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/api/auth/me');
        setUser(res.data.user);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Session expired or authentication failed. Redirecting to login...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255, 255, 255, 0.1)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading your dashboard...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        padding: '1rem'
      }}>
        <div className="alert alert-error" style={{ maxWidth: '400px', width: '100%' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem', flex: 1 }}>
      <header style={{
        display: 'flex',
        justifyContent: 'between',
        alignItems: 'center',
        marginBottom: '3rem',
        flexWrap: 'wrap',
        gap: '1.5rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1.5rem'
      }}>
        <div style={{ flex: 1 }}>
          <span style={{
            fontSize: '0.875rem',
            color: 'var(--color-secondary)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Welcome back, Traveler ✈️
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.25rem' }}>
            {user?.name}'s Vault
          </h1>
        </div>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Sign Out
        </button>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginTop: '1rem'
      }}>
        {/* Profile Card */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.5rem',
              color: '#fff'
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{user?.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user?.email}</p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Account Created: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>

        {/* Action card / Quick Info */}
        <div className="glass-card" style={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(14, 165, 233, 0.03) 100%)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Start Mapping Memories
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Your TripVault is active. In the upcoming weeks, you will be able to add detailed logs, pin maps, and upload photos of your favorite journeys.
            </p>
          </div>
          <button className="btn btn-primary" style={{ width: 'fit-content' }} disabled>
            + Create New Log (Week 2)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
