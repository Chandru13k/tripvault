import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Star, Globe, Compass, ShieldCheck, BookOpen, Camera } from 'lucide-react';
import api from '../api';
import { ProfileSkeleton } from '../components/Skeletons';

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

  if (error || !profile) {
    return (
      <div style={{ maxWidth: '800px', margin: '7rem auto 3rem auto', padding: '0 1.5rem', flex: 1 }}>
        <div className="card-editorial" style={{ padding: '3rem', textAlign: 'center', color: '#fca5a5' }}>
          <Compass size={48} color="var(--text-subtle)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Traveler Profile Unavailable</h2>
          <p style={{ color: 'var(--text-muted)' }}>{error || 'The requested traveler profile does not exist.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '1060px',
        margin: '0 auto',
        padding: '7rem 1.5rem 4rem 1.5rem',
        width: '100%',
        flex: 1,
      }}
      className="animate-fade-in"
    >
      {/* Traveler Profile Hero Card */}
      <div
        className="card-editorial"
        style={{
          padding: '3.5rem 2.5rem',
          textAlign: 'center',
          marginBottom: '3.5rem',
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(22, 27, 34, 0.95), rgba(13, 17, 23, 0.95))',
        }}
      >
        <div className="travel-badge" style={{ marginBottom: '1.5rem' }}>
          <ShieldCheck size={14} color="var(--accent-terracotta)" /> VERIFIED TRAVELER JOURNAL
        </div>

        <div
          style={{
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            background: 'var(--accent-terracotta)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            fontFamily: 'var(--font-editorial)',
            fontWeight: 700,
            margin: '0 auto 1.5rem auto',
            boxShadow: 'var(--shadow-photo)',
            border: '4px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
        </div>

        <h1 style={{ fontFamily: 'var(--font-editorial)', fontSize: '2.5rem', color: '#ffffff', marginBottom: '0.25rem' }}>
          {profile.name}
        </h1>
        <div
          style={{
            color: 'var(--accent-sand)',
            fontFamily: 'var(--font-label)',
            fontWeight: 700,
            fontSize: '1.05rem',
            marginBottom: '1.5rem',
          }}
        >
          @{profile.username}
        </div>

        {profile.bio ? (
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
            "{profile.bio}"
          </p>
        ) : (
          <p style={{ color: 'var(--text-subtle)', fontStyle: 'italic' }}>No bio provided yet.</p>
        )}

        <div style={{ marginTop: '2rem', display: 'inline-flex', gap: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.6rem', fontWeight: 700, color: '#fff', display: 'block' }}>{trips.length}</span>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Journeys Logged</span>
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent-sand)', display: 'block' }}>
              {new Set(trips.map((t) => t.destination)).size}
            </span>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Destinations</span>
          </div>
        </div>
      </div>

      {/* Published Journeys Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Globe size={22} color="var(--accent-terracotta)" /> Published Journeys by {profile.name}
        </h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-label)' }}>
          {trips.length} {trips.length === 1 ? 'Trip' : 'Trips'} Logged
        </span>
      </div>

      {/* Trips Grid with Enforced Geometry */}
      {trips.length === 0 ? (
        <div className="card-editorial" style={{ padding: '3.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>This traveler has not published any trips yet.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem',
          }}
        >
          {trips.map((trip, idx) => (
            <div
              key={trip._id}
              className="card-editorial animate-slide-up"
              style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                animationDelay: `${idx * 0.05}s`,
              }}
            >
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img
                  src={
                    trip.coverImage ||
                    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=85'
                  }
                  alt={trip.title}
                  className="card-ratio-16-9"
                />
                <div className="photo-overlay-bottom" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />

                <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 2 }}>
                  {trip.rating && (
                    <div
                      style={{
                        background: 'rgba(13, 17, 23, 0.85)',
                        backdropFilter: 'blur(8px)',
                        color: '#fbbf24',
                        padding: '0.25rem 0.6rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.775rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <Star size={13} fill="#fbbf24" color="#fbbf24" />
                      {trip.rating}/5
                    </div>
                  )}
                </div>
              </div>

              <div style={{ padding: '1.5rem', background: 'var(--bg-card)', flex: 1 }}>
                <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.4rem', color: '#ffffff', marginBottom: '0.35rem' }}>
                  {trip.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-sand)', fontSize: '0.875rem', fontWeight: 600 }}>
                  <MapPin size={15} color="var(--accent-terracotta)" />
                  {trip.destination}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicProfile;
