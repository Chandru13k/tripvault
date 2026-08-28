import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import TripModal from '../components/TripModal';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, tripsRes] = await Promise.all([
          api.get('/api/auth/me'),
          api.get('/api/trips')
        ]);
        setUser(userRes.data.user);
        setTrips(tripsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data. Redirecting...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleOpenCreateModal = () => {
    setCurrentTrip(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (trip) => {
    setCurrentTrip(trip);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTrip(null);
  };

  const handleSubmitTrip = async (tripData) => {
    if (currentTrip) {
      // Update
      const res = await api.put(`/api/trips/${currentTrip._id}`, tripData);
      setTrips(trips.map(t => t._id === currentTrip._id ? res.data : t));
    } else {
      // Create
      const res = await api.post('/api/trips', tripData);
      setTrips([res.data, ...trips]);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await api.delete(`/api/trips/${tripId}`);
        setTrips(trips.filter(t => t._id !== tripId));
      } catch (err) {
        alert('Failed to delete trip: ' + (err.response?.data?.message || err.message));
      }
    }
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
        justifyContent: 'space-between',
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
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={handleOpenCreateModal}>
            + Create Trip
          </button>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </header>

      {trips.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No trips yet.</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Start creating your first travel memory!
          </p>
          <button className="btn btn-primary" onClick={handleOpenCreateModal}>
            + Create Trip
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {trips.map(trip => (
            <div key={trip._id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, paddingRight: '1rem' }}>{trip.title}</h3>
                <div style={{ background: 'var(--color-primary)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  ★ {trip.rating}/5
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>📍 {trip.destination}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                📅 {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'TBD'} - {trip.endDate ? new Date(trip.endDate).toLocaleDateString() : 'TBD'}
              </p>
              {trip.description && (
                <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1 }}>{trip.description}</p>
              )}
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <button 
                  onClick={() => handleOpenEditModal(trip)}
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteTrip(trip._id)}
                  style={{ 
                    flex: 1, padding: '0.5rem', fontSize: '0.9rem', 
                    background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', 
                    borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => { e.target.style.background = '#ef4444'; e.target.style.color = '#fff'; }}
                  onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#ef4444'; }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TripModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTrip}
        initialData={currentTrip}
      />
    </div>
  );
};

export default Dashboard;
