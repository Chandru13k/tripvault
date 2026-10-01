import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Star,
  Upload,
  Image as ImageIcon,
  Loader2,
  X,
  Compass,
  BookOpen,
} from 'lucide-react';
import api from '../api';
import { TripDetailSkeleton } from '../components/Skeletons';
import { useToast } from '../components/Toast';

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
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
      await api.post(`/api/trips/${id}/upload`, formData);
      showToast('Photo uploaded to gallery successfully!', 'success');
      await fetchTrip();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to upload image';
      showToast(errMsg, 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  if (loading) return <TripDetailSkeleton />;

  if (error || !trip) {
    return (
      <div style={{ maxWidth: '800px', margin: '7rem auto 3rem auto', padding: '0 1.5rem', flex: 1 }}>
        <div className="card-editorial" style={{ padding: '2rem', textAlign: 'center', color: '#fca5a5' }}>
          {error || 'Trip not found.'}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '1180px',
        margin: '0 auto',
        padding: '7rem 1.5rem 4rem 1.5rem',
        width: '100%',
        flex: 1,
      }}
      className="animate-fade-in"
    >
      <button
        onClick={() => navigate('/dashboard')}
        className="btn-editorial-outline"
        style={{ marginBottom: '2rem', fontSize: '0.9rem', padding: '0.55rem 1.25rem' }}
      >
        <ArrowLeft size={16} /> Back to My Journal
      </button>

      {/* Hero Cover Banner */}
      <div
        className="card-editorial"
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          minHeight: '440px',
          marginBottom: '3rem',
          backgroundImage: trip.coverImage
            ? `url(${trip.coverImage})`
            : 'linear-gradient(135deg, #1c222c, #0d1117)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '3rem 2.5rem',
        }}
      >
        <div className="photo-overlay-hero" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <span
              style={{
                background: 'rgba(13, 17, 23, 0.85)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--accent-sand)',
                padding: '0.35rem 0.95rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 700,
                fontFamily: 'var(--font-label)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <MapPin size={14} color="var(--accent-terracotta)" /> {trip.destination}
            </span>

            {trip.rating && (
              <span
                style={{
                  background: 'rgba(13, 17, 23, 0.85)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fbbf24',
                  padding: '0.35rem 0.95rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Star size={14} fill="#fbbf24" color="#fbbf24" /> {trip.rating} / 5 Stars
              </span>
            )}
          </div>

          <h1 className="heading-hero" style={{ color: '#ffffff', marginBottom: '0.75rem' }}>
            {trip.title}
          </h1>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.925rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
            {trip.startDate && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={15} color="var(--accent-terracotta)" /> Start: {new Date(trip.startDate).toLocaleDateString()}
              </span>
            )}
            {trip.endDate && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={15} color="var(--accent-sand)" /> End: {new Date(trip.endDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.75fr', gap: '2.5rem' }} className="detail-layout">
        {/* Left Info Column */}
        <div className="card-editorial" style={{ padding: '2.25rem', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-editorial)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} color="var(--accent-terracotta)" /> Journal Log
          </h3>

          {trip.rating && (
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-label)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-subtle)', display: 'block', marginBottom: '0.4rem' }}>
                Experience Rating
              </span>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    fill={i < trip.rating ? '#fbbf24' : 'transparent'}
                    color={i < trip.rating ? '#fbbf24' : 'var(--text-subtle)'}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-label)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-subtle)', display: 'block', marginBottom: '0.5rem' }}>
              Traveler Notes & Observations
            </span>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.975rem', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
              {trip.description || 'No notes logged for this journey yet.'}
            </p>
          </div>
        </div>

        {/* Right Gallery Column */}
        <div className="card-editorial" style={{ padding: '2.25rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-editorial)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <ImageIcon size={20} color="var(--accent-sand)" /> Photographic Vault
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-label)' }}>
                {trip.photos ? trip.photos.length : 0} High-Res Memories
              </span>
            </div>

            <div>
              <input
                type="file"
                id="photo-upload-input"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                disabled={uploading}
              />
              <label
                htmlFor="photo-upload-input"
                className="btn-cinematic"
                style={{
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  opacity: uploading ? 0.7 : 1,
                  fontSize: '0.85rem',
                  padding: '0.55rem 1.25rem',
                }}
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} /> Add Photo
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Gallery Grid */}
          {trip.photos && trip.photos.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '1.15rem',
              }}
            >
              {trip.photos.map((photo, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPhoto(photo)}
                  style={{
                    height: '150px',
                    borderRadius: 'var(--radius-md)',
                    backgroundImage: `url(${photo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--border-subtle)',
                    transition: 'transform 0.25s ease',
                  }}
                  className="gallery-item-hover"
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '3.5rem 1.5rem',
                border: '2px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)',
              }}
            >
              <ImageIcon size={40} color="var(--text-subtle)" style={{ marginBottom: '0.75rem' }} />
              <p style={{ fontSize: '0.95rem', marginBottom: '1.25rem' }}>No photos uploaded to this gallery yet.</p>
              <label htmlFor="photo-upload-input" className="btn-editorial-outline" style={{ cursor: 'pointer', fontSize: '0.85rem' }}>
                Upload First Photograph
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 3000,
            background: 'rgba(13, 17, 23, 0.95)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={24} />
          </button>
          <img
            src={selectedPhoto}
            alt="Expanded view"
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              objectFit: 'contain',
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <style>{`
        @media (max-width: 850px) {
          .detail-layout { grid-template-columns: 1fr !important; }
        }
        .gallery-item-hover:hover {
          transform: scale(1.04);
          border-color: var(--accent-terracotta) !important;
        }
      `}</style>
    </div>
  );
};

export default TripDetail;
