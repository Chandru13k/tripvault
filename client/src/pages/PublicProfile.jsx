import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { ProfileSkeleton } from '../components/SkeletonLoader';

// Public Profile Component
const PublicProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/api/users/${username}/profile`);
        setProfile(res.data.user);
        setTrips(res.data.trips);
      } catch (err) {
        setError(err.response?.data?.message || 'Profile not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) return <ProfileSkeleton />;
  if (error) return <div className="container" style={{ padding: '3rem 1.5rem', flex: 1 }}><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{
        background: 'var(--card-bg)',
        padding: '2rem',
        borderRadius: '15px',
        boxShadow: '0 8px 32px var(--shadow-color)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--border-color)',
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          margin: '0 auto 1rem auto',
          fontWeight: 'bold'
        }}>
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <h2 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>{profile.name}</h2>
        <p style={{ color: 'var(--color-primary)', fontWeight: '600', marginBottom: '1rem' }}>@{profile.username}</p>
        
        {profile.bio ? (
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
            {profile.bio}
          </p>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>No bio provided.</p>
        )}
      </div>

      <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        Trips by {profile.name}
      </h3>

      {trips.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--card-bg)', borderRadius: '15px' }}>
          <p style={{ color: 'var(--text-muted)' }}>This user hasn't shared any trips yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {trips.map(trip => (
            <div key={trip._id} style={{
              background: 'var(--card-bg)',
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 4px 15px var(--shadow-color)',
              border: '1px solid var(--border-color)',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {trip.coverImage ? (
                <div style={{ height: '180px', backgroundImage: `url(${trip.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              ) : (
                <div style={{ height: '180px', background: 'linear-gradient(45deg, #f3f4f6, #e5e7eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '3rem' }}>📸</span>
                </div>
              )}
              <div style={{ padding: '1.25rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{trip.title}</h4>
                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  📍 {trip.destination}
                </p>
                {trip.rating && (
                  <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.5rem' }}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: i < trip.rating ? '#fbbf24' : '#e5e7eb' }}>★</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicProfile;
