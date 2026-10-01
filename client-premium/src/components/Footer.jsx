import React from 'react';
import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(13, 17, 23, 0.95)',
        padding: '1.25rem 1.5rem',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.875rem',
          color: 'var(--text-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Compass size={18} color="var(--accent-terracotta)" />
          <span style={{ fontFamily: 'var(--font-editorial)', fontWeight: 700, color: '#ffffff', fontSize: '1rem' }}>
            TripVault
          </span>
          <span>— Personal Travel Journal & Memory Vault</span>
        </div>

        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', fontFamily: 'var(--font-label)' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Explore</Link>
          <Link to="/dashboard" style={{ color: 'var(--text-muted)' }}>My Journeys</Link>
          <span>© {new Date().getFullYear()} TripVault</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
