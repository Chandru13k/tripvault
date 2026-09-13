import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import TripModal from '../components/TripModal';
import { CardGridSkeleton } from '../components/SkeletonLoader';
import { useToast } from '../components/Toast';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const fetchTrips = async () => {
    try {
      const tripsRes = await api.get('/api/trips');
      setTrips(tripsRes.data);
    } catch (err) {
      console.error('Error fetching trips:', err);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
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
        showToast('Session expired or error loading dashboard.', 'error');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [navigate, showToast]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showToast('Logged out successfully', 'info');
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

  const handleSubmitTrip = async (tripData, imageFile) => {
    try {
      let tripId;
      const isEditing = Boolean(currentTrip);
      if (isEditing) {
        await api.put(`/api/trips/${currentTrip._id}`, tripData);
        tripId = currentTrip._id;
      } else {
        const res = await api.post('/api/trips', tripData);
        tripId = res.data._id;
      }

      // If an image was selected, upload it
      if (imageFile && tripId) {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        await api.post(`/api/trips/${tripId}/upload`, formData);
      }

      showToast(
        isEditing ? 'Trip updated successfully!' : 'Trip created successfully!',
        'success'
      );
      await fetchTrips();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save trip.', 'error');
      throw err;
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        setDeletingId(tripId);
        await api.delete(`/api/trips/${tripId}`);
        showToast('Trip deleted successfully.', 'info');
        await fetchTrips();
      } catch (err) {
        showToast('Failed to delete trip: ' + (err.response?.data?.message || err.message), 'error');
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem', flex: 1 }}>
        <div style={{ marginBottom: '2rem' }}>
          <div className="skeleton skeleton-title" style={{ width: '30%' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '20%' }}></div>
        </div>
        <CardGridSkeleton count={6} />
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
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user?.username && (
            <button className="btn" onClick={() => navigate(`/profile/${user.username}`)} style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', fontWeight: 'bold' }}>
              My Profile
            </button>
          )}
          <button className="btn btn-secondary" onClick={() => navigate('/edit-profile')}>
            Edit Profile
          </button>
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
            <div key={trip._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
              {trip.coverImage ? (
                <div style={{ height: '160px', backgroundImage: `url(${trip.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              ) : (
                <div style={{ height: '160px', background: 'linear-gradient(45deg, #f3f4f6, #e5e7eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '2.5rem' }}>🌍</span>
                </div>
              )}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
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
                  onClick={() => navigate(`/trips/${trip._id}`)}
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}
                >
                  View
                </button>
                <button 
                  onClick={() => handleOpenEditModal(trip)}
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteTrip(trip._id)}
                  disabled={deletingId === trip._id}
                  style={{ 
                    flex: 1, padding: '0.5rem', fontSize: '0.9rem', 
                    background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', 
                    borderRadius: '8px', cursor: deletingId === trip._id ? 'not-allowed' : 'pointer', fontWeight: 600,
                    transition: 'all 0.2s ease', opacity: deletingId === trip._id ? 0.5 : 1
                  }}
                  onMouseOver={(e) => { if (deletingId !== trip._id) { e.target.style.background = '#ef4444'; e.target.style.color = '#fff'; } }}
                  onMouseOut={(e) => { if (deletingId !== trip._id) { e.target.style.background = 'transparent'; e.target.style.color = '#ef4444'; } }}
                >
                  {deletingId === trip._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
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
