import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  MapPin,
  Calendar,
  Star,
  Eye,
  Edit,
  Trash2,
  Search,
  SlidersHorizontal,
  Globe,
  BookOpen,
  User,
  Loader2,
  Compass,
  ArrowRight,
  Camera,
} from 'lucide-react';
import api from '../api';
import TripModal from '../components/TripModal';
import { PageSkeleton } from '../components/Skeletons';
import { useToast } from '../components/Toast';
import AnimatedCounter from '../components/AnimatedCounter';
import MagneticButton from '../components/MagneticButton';
import { HERO_BG, EDITORIAL_MAIN } from '../config/images';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Modal State
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
          api.get('/api/trips'),
        ]);
        setUser(userRes.data.user);
        setTrips(tripsRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Session expired or error loading journal data.');
        showToast('Session expired. Redirecting...', 'error');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [navigate, showToast]);

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
      const isEditing = Boolean(currentTrip);
      
      if (imageFile) {
        const formData = new FormData();
        Object.keys(tripData).forEach((key) => {
          if (tripData[key] !== undefined && tripData[key] !== null) {
            formData.append(key, tripData[key]);
          }
        });
        formData.append('image', imageFile);

        if (isEditing) {
          await api.put(`/api/trips/${currentTrip._id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else {
          await api.post('/api/trips', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
      } else {
        if (isEditing) {
          await api.put(`/api/trips/${currentTrip._id}`, tripData);
        } else {
          await api.post('/api/trips', tripData);
        }
      }

      showToast(
        isEditing ? 'Trip updated successfully!' : 'Journey saved to vault successfully!',
        'success'
      );
      await fetchTrips();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save trip.', 'error');
      throw err;
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip from your journal?')) {
      try {
        setDeletingId(tripId);
        await api.delete(`/api/trips/${tripId}`);
        showToast('Trip removed successfully.', 'info');
        setTrips((prev) => prev.filter((t) => t._id !== tripId));
      } catch (err) {
        showToast('Failed to delete trip: ' + (err.response?.data?.message || err.message), 'error');
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    const totalTrips = trips.length;
    const destinations = new Set(trips.map((t) => t.destination)).size;
    const avgRating = totalTrips
      ? trips.reduce((acc, curr) => acc + (curr.rating || 0), 0) / totalTrips
      : 0;
    return { totalTrips, destinations, avgRating };
  }, [trips]);

  // Filtered & Sorted Trips
  const filteredTrips = useMemo(() => {
    return trips
      .filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.destination.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [trips, searchQuery, sortBy]);

  // Split featured trip (first/latest) from remaining trips
  const featuredTrip = filteredTrips[0] || null;
  const remainingTrips = filteredTrips.slice(1);

  if (loading) return <PageSkeleton />;

  if (error) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="card-editorial" style={{ padding: '2rem', textAlign: 'center', color: '#fca5a5' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '6rem 1.5rem 4rem 1.5rem',
        width: '100%',
        flex: 1,
      }}
      className="animate-fade-in"
    >
      {/* 1. COMPACT EDEITORIAL GREETING & HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
        className="animate-slide-up"
      >
        <div>
          <span className="label-caps" style={{ letterSpacing: '0.18em' }}>
            WELCOME BACK, {user?.name ? user.name.toUpperCase() : 'TRAVELER'}
          </span>
          <h1 className="heading-section" style={{ color: '#ffffff', marginTop: '0.25rem' }}>
            Your Journeys, Memories & Places.
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/edit-profile')} className="btn-editorial-outline" style={{ fontSize: '0.875rem', padding: '0.55rem 1.25rem' }}>
            <User size={15} /> Profile
          </button>
          <MagneticButton onClick={handleOpenCreateModal} className="btn-cinematic" style={{ fontSize: '0.875rem', padding: '0.55rem 1.35rem' }} dataCursor="NEW +">
            <PlusCircle size={16} /> Log Journey
          </MagneticButton>
        </div>
      </div>

      {/* 2. ANIMATED COMPACT STATISTICS STRIP */}
      <div
        style={{
          display: 'flex',
          gap: '2.5rem',
          marginBottom: '2.5rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          flexWrap: 'wrap',
        }}
        className="animate-slide-up"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <BookOpen size={18} color="var(--accent-terracotta)" />
          <div>
            <span style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
              <AnimatedCounter value={stats.totalTrips} />
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginLeft: '0.5rem', fontFamily: 'var(--font-label)', textTransform: 'uppercase' }}>
              Journeys Logged
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Globe size={18} color="var(--accent-ocean)" />
          <div>
            <span style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
              <AnimatedCounter value={stats.destinations} />
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginLeft: '0.5rem', fontFamily: 'var(--font-label)', textTransform: 'uppercase' }}>
              Destinations
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Star size={18} color="var(--accent-gold)" fill="var(--accent-gold)" />
          <div>
            <span style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
              <AnimatedCounter value={stats.avgRating} decimals={1} />
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginLeft: '0.5rem', fontFamily: 'var(--font-label)', textTransform: 'uppercase' }}>
              Avg Experience Score
            </span>
          </div>
        </div>
      </div>

      {/* 3. DATA-DRIVEN LAYOUT DISPATCHER */}

      {/* CASE A: ZERO TRIPS (BEAUTIFUL ONBOARDING STATE) */}
      {trips.length === 0 && (
        <div
          className="card-editorial animate-slide-up"
          style={{
            position: 'relative',
            minHeight: '440px',
            backgroundImage: `url(${HERO_BG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '3.5rem 2.5rem',
            textAlign: 'left',
          }}
        >
          <div className="photo-overlay-hero" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '580px' }}>
            <span className="travel-badge" style={{ marginBottom: '1rem' }}>
              JOURNAL READY
            </span>
            <h2 className="heading-hero" style={{ fontSize: '2.5rem', color: '#ffffff', marginBottom: '0.75rem' }}>
              Your First Journey Is Waiting.
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.88)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              Start documenting the places that matter, photos that inspire, and memories that stay with you.
            </p>
            <MagneticButton onClick={handleOpenCreateModal} className="btn-cinematic" dataCursor="LOG +">
              <PlusCircle size={18} /> + Log Your First Journey
            </MagneticButton>
          </div>
        </div>
      )}

      {/* CASE B: FEATURED TRIP HERO (FOR 1+ TRIPS) */}
      {featuredTrip && (
        <div style={{ marginBottom: '3.5rem' }} className="animate-slide-up">
          <div
            className="card-editorial featured-journey-hero"
            style={{
              position: 'relative',
              minHeight: trips.length === 1 ? '480px' : '420px',
              display: 'grid',
              gridTemplateColumns: trips.length === 1 ? '1.2fr 0.8fr' : '1fr',
              overflow: 'hidden',
            }}
          >
            {/* Background Cover Image with Hover Zoom */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${
                  featuredTrip.coverImage ||
                  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85'
                })`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="featured-hero-image"
            />
            <div className="photo-overlay-hero" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />

            {/* Overlaid Details */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '3rem 2.5rem',
              }}
            >
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span
                  style={{
                    background: 'rgba(13, 17, 23, 0.85)',
                    backdropFilter: 'blur(10px)',
                    color: 'var(--accent-sand)',
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-label)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <MapPin size={14} color="var(--accent-terracotta)" /> {featuredTrip.destination}
                </span>

                {featuredTrip.rating && (
                  <span
                    style={{
                      background: 'rgba(13, 17, 23, 0.85)',
                      backdropFilter: 'blur(10px)',
                      color: '#fbbf24',
                      padding: '0.35rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    <Star size={14} fill="#fbbf24" color="#fbbf24" /> ★ {featuredTrip.rating}.0
                  </span>
                )}

                <span
                  style={{
                    background: 'rgba(217, 107, 67, 0.2)',
                    border: '1px solid var(--accent-terracotta)',
                    color: '#ffffff',
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-label)',
                    textTransform: 'uppercase',
                  }}
                >
                  FEATURED JOURNEY
                </span>
              </div>

              <h2 className="heading-section" style={{ color: '#ffffff', marginBottom: '0.5rem' }}>
                {featuredTrip.title}
              </h2>

              <div
                style={{
                  fontSize: '0.925rem',
                  color: 'rgba(255, 255, 255, 0.85)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginBottom: '1.25rem',
                }}
              >
                <Calendar size={15} color="var(--accent-sand)" />
                {featuredTrip.startDate ? new Date(featuredTrip.startDate).toLocaleDateString() : 'TBD'} —{' '}
                {featuredTrip.endDate ? new Date(featuredTrip.endDate).toLocaleDateString() : 'TBD'}
              </div>

              {featuredTrip.description && (
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1rem', maxWidth: '620px', lineHeight: 1.6, marginBottom: '2rem' }}>
                  {featuredTrip.description}
                </p>
              )}

              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                <MagneticButton
                  onClick={() => navigate(`/trips/${featuredTrip._id}`)}
                  className="btn-cinematic"
                  style={{ padding: '0.75rem 1.6rem', fontSize: '0.95rem' }}
                  dataCursor="VIEW →"
                >
                  <Eye size={16} /> View Journey <ArrowRight size={16} />
                </MagneticButton>

                <button
                  onClick={() => handleOpenEditModal(featuredTrip)}
                  className="btn-editorial-outline"
                  style={{ padding: '0.75rem 1.25rem', fontSize: '0.95rem' }}
                >
                  <Edit size={16} /> Edit
                </button>

                <button
                  onClick={() => handleDeleteTrip(featuredTrip._id)}
                  disabled={deletingId === featuredTrip._id}
                  className="btn-danger-glass"
                  style={{ padding: '0.75rem 1.1rem', fontSize: '0.9rem' }}
                >
                  {deletingId === featuredTrip._id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CASE C: REMAINING TRIPS COLLECTION (FOR 2+ TRIPS) */}
      {remainingTrips.length > 0 && (
        <div>
          {/* Toolbar: Search and Filter */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1.25rem',
              marginBottom: '2rem',
              flexWrap: 'wrap',
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.75rem', color: '#fff' }}>
              Journey Collection ({filteredTrips.length})
            </h3>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', minWidth: '260px' }}>
                <Search
                  size={16}
                  color="var(--text-subtle)"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="text"
                  placeholder="Filter journeys..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-editorial"
                  style={{ paddingLeft: '40px', padding: '0.6rem 1rem 0.6rem 40px', fontSize: '0.875rem' }}
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-editorial"
                style={{ width: 'auto', cursor: 'pointer', fontFamily: 'var(--font-label)', fontSize: '0.85rem', padding: '0.6rem 1rem' }}
              >
                <option value="newest">Sort by Recent</option>
                <option value="rating">Highest Rating</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Standard 4:3 Trip Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {remainingTrips.map((trip, idx) => (
              <div
                key={trip._id}
                className="card-editorial animate-slide-up trip-card-container"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  animationDelay: `${idx * 0.05}s`,
                  transition: 'all 0.35s ease',
                }}
              >
                {/* 4:3 Aspect Ratio Image Container */}
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={
                      trip.coverImage ||
                      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=85'
                    }
                    alt={trip.title}
                    className="card-ratio-4-3 trip-card-image"
                    style={{ transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
                  />
                  <div className="photo-overlay-bottom" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />

                  {/* Overlaid Location Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      right: '1rem',
                      zIndex: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(13, 17, 23, 0.85)',
                        backdropFilter: 'blur(8px)',
                        color: 'var(--accent-sand)',
                        padding: '0.3rem 0.75rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-label)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <MapPin size={13} color="var(--accent-terracotta)" />
                      {trip.destination}
                    </div>

                    {trip.rating && (
                      <div
                        style={{
                          background: 'rgba(13, 17, 23, 0.85)',
                          backdropFilter: 'blur(8px)',
                          color: '#fbbf24',
                          padding: '0.3rem 0.65rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.8rem',
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

                {/* Card Content & Hover Action Bar */}
                <div
                  style={{
                    padding: '1.5rem',
                    background: 'var(--bg-card)',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-editorial)',
                        fontSize: '1.4rem',
                        color: '#ffffff',
                        marginBottom: '0.35rem',
                      }}
                    >
                      {trip.title}
                    </h3>

                    <div
                      style={{
                        fontSize: '0.825rem',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        marginBottom: '1rem',
                      }}
                    >
                      <Calendar size={14} color="var(--accent-sand)" />
                      {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'TBD'} —{' '}
                      {trip.endDate ? new Date(trip.endDate).toLocaleDateString() : 'TBD'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem' }}>
                    <button
                      onClick={() => navigate(`/trips/${trip._id}`)}
                      className="btn-cinematic"
                      style={{ flex: 1, padding: '0.55rem 0.85rem', fontSize: '0.85rem' }}
                      dataCursor="VIEW →"
                    >
                      <Eye size={15} /> View Journal
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(trip)}
                      className="btn-editorial-outline"
                      style={{ padding: '0.55rem 0.85rem', fontSize: '0.85rem' }}
                      title="Edit Trip"
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteTrip(trip._id)}
                      disabled={deletingId === trip._id}
                      className="btn-danger-glass"
                      title="Delete Trip"
                    >
                      {deletingId === trip._id ? <Loader2 className="animate-spin" size={15} /> : <Trash2 size={15} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trip Modal */}
      <TripModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTrip}
        initialData={currentTrip}
      />

      <style>{`
        .featured-journey-hero:hover .featured-hero-image {
          transform: scale(1.04);
        }
        .trip-card-container:hover .trip-card-image {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
