import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { DetailSkeleton } from '../components/SkeletonLoader';
import { useToast } from '../components/Toast';

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  const fetchTrip = async () => {
    try {
      const res = await api.get(`/api/trips/${id}`);
      setTrip(res.data);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to load trip details';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      await api.post(`/api/trips/${id}/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });
      showToast('Photo uploaded successfully!', 'success');
      // Refresh trip data to show new photo
      await fetchTrip();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to upload image';
      showToast(errMsg, 'error');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  if (loading) return <DetailSkeleton />;
  if (error) return <div className="container" style={{ padding: '3rem 1.5rem', flex: 1 }}><div className="alert alert-error">{error}</div></div>;
  if (!trip) return null;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
      
      <button 
        onClick={() => navigate('/dashboard')}
        className="btn btn-secondary"
        style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
      >
        ← Back to Dashboard
      </button>

      {/* Cover Section */}
      <div style={{
        position: 'relative',
        borderRadius: '15px',
        overflow: 'hidden',
        height: '400px',
        marginBottom: '2rem',
        boxShadow: '0 8px 32px var(--shadow-color)',
        backgroundColor: '#e5e7eb',
        backgroundImage: trip.coverImage ? `url(${trip.coverImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
          padding: '2rem',
          color: 'white'
        }}>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem' }}>{trip.title}</h1>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', opacity: 0.9 }}>📍 {trip.destination}</p>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
            {trip.startDate && <span>Start: {new Date(trip.startDate).toLocaleDateString()}</span>}
            {trip.endDate && <span>End: {new Date(trip.endDate).toLocaleDateString()}</span>}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '3rem' }}>
        <div style={{
          background: 'var(--card-bg)',
          padding: '1.5rem',
          borderRadius: '15px',
          boxShadow: '0 4px 15px var(--shadow-color)',
          border: '1px solid var(--border-color)',
          alignSelf: 'start'
        }}>
          <h3 style={{ marginTop: 0 }}>Details</h3>
          {trip.rating && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
              <strong>Rating:</strong>
              <div style={{ color: '#fbbf24', fontSize: '1.2rem' }}>
                {'★'.repeat(trip.rating)}{'☆'.repeat(5 - trip.rating)}
              </div>
            </div>
          )}
          
          <div style={{ marginTop: '1rem' }}>
            <strong>Description:</strong>
            <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', marginTop: '0.5rem' }}>
              {trip.description || 'No description provided.'}
            </p>
          </div>
        </div>

        {/* Photos Grid */}
        <div style={{
          background: 'var(--card-bg)',
          padding: '1.5rem',
          borderRadius: '15px',
          boxShadow: '0 4px 15px var(--shadow-color)',
          border: '1px solid var(--border-color)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>Photo Gallery</h3>
            <div>
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                disabled={uploading}
              />
              <label 
                htmlFor="photo-upload" 
                className="btn btn-primary"
                style={{ cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.7 : 1 }}
              >
                {uploading ? 'Uploading...' : 'Add Photo'}
              </label>
            </div>
          </div>

          {trip.photos && trip.photos.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
              {trip.photos.map((photo, idx) => (
                <div key={idx} style={{
                  height: '150px',
                  borderRadius: '10px',
                  backgroundImage: `url(${photo})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', border: '2px dashed var(--border-color)', borderRadius: '10px' }}>
              No photos uploaded yet. Click "Add Photo" to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetail;
