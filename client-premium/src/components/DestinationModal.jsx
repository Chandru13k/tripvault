import React from 'react';
import { X, MapPin, Star, BookOpen, Compass, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DestinationModal = ({ destination, onClose }) => {
  const navigate = useNavigate();
  if (!destination) return null;

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 4000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'rgba(13, 17, 23, 0.9)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onClick={onClose}
    >
      <div
        className="card-editorial animate-slide-up"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 0,
          position: 'relative',
          background: 'var(--bg-main)',
          border: '1px solid var(--border-strong)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            background: 'rgba(13, 17, 23, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={20} />
        </button>

        {/* Large Cover Image */}
        <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
          <img
            src={destination.image}
            alt={destination.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div className="photo-overlay-bottom" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
          <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.75rem', zIndex: 2 }}>
            <span className="travel-badge" style={{ marginBottom: '0.5rem' }}>
              {destination.tag}
            </span>
            <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '2.2rem', color: '#ffffff', margin: 0 }}>
              {destination.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.75rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-label)', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                Journal Memories
              </span>
              <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-editorial)', color: '#fff', fontWeight: 700, marginTop: '2px' }}>
                {destination.memories} Logged
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-label)', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                Region Rating
              </span>
              <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-editorial)', color: 'var(--accent-gold)', fontWeight: 700, marginTop: '2px' }}>
                ★ 4.9 / 5.0
              </div>
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.975rem', lineHeight: 1.65, marginBottom: '2rem' }}>
            Explore authentic traveler itineraries, photographic galleries, and trip notes logged for {destination.name}.
          </p>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={onClose} className="btn-editorial-outline" style={{ flex: 1, justifyContent: 'center' }}>
              Close Overlay
            </button>
            <button
              onClick={() => {
                onClose();
                navigate('/dashboard');
              }}
              className="btn-cinematic"
              style={{ flex: 1.5, justifyContent: 'center' }}
            >
              Explore In My Journal <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationModal;
