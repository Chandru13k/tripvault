import React from 'react';
import { X, MapPin, Calendar, BookOpen, Heart } from 'lucide-react';
import { EDITORIAL_MAIN } from '../config/images';

const StoryModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
        background: 'rgba(13, 17, 23, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      onClick={onClose}
    >
      <div
        className="card-editorial animate-slide-up"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2.5rem',
          position: 'relative',
          background: 'var(--bg-main)',
          border: '1px solid var(--border-strong)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
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

        <span className="travel-badge" style={{ marginBottom: '1rem' }}>
          Editorial Feature Story
        </span>

        <h1 style={{ fontFamily: 'var(--font-editorial)', fontSize: '2.4rem', color: '#ffffff', marginBottom: '0.75rem', lineHeight: 1.15 }}>
          Cruising the Tyrrhenian Horizons: Notes from the Amalfi Cliffside
        </h1>

        <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={14} color="var(--accent-terracotta)" /> Positano, Italy
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={14} color="var(--accent-sand)" /> Logged August 2025
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <BookOpen size={14} color="var(--accent-ocean)" /> 5 Min Read
          </span>
        </div>

        <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '2rem' }}>
          <img src={EDITORIAL_MAIN} alt="Story cover" className="card-ratio-16-9" />
        </div>

        <div style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p>
            The morning light over Positano breaks in shades of warm amber and deep cyan. Perched high above the cliffside roads, the Mediterranean stretches endlessly toward the horizon.
          </p>
          <p>
            Every winding alleyway reveals hidden bakery doors, lemon arbors, and ancient stone stairways leading down to crystal cove waters. Documenting these quiet morning walks is what makes travel journals priceless over time.
          </p>
          <blockquote style={{ borderLeft: '3px solid var(--accent-terracotta)', paddingLeft: '1.25rem', fontStyle: 'italic', fontFamily: 'var(--font-editorial)', fontSize: '1.35rem', color: 'var(--accent-sand)' }}>
            "We travel not to escape life, but for life not to escape us."
          </blockquote>
        </div>

        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>Logged by @wanderlust_journal</span>
          <button onClick={onClose} className="btn-cinematic" style={{ padding: '0.55rem 1.35rem', fontSize: '0.875rem' }}>
            Done Reading
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryModal;
