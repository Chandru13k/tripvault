import React from 'react';

export const TripCardSkeleton = () => (
  <div className="glass-card shimmer" style={{ height: '340px', borderRadius: 'var(--radius-md)' }} />
);

export const CardGridSkeleton = ({ count = 6 }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.75rem',
      width: '100%',
    }}
  >
    {Array.from({ length: count }).map((_, i) => (
      <TripCardSkeleton key={i} />
    ))}
  </div>
);

export const ProfileSkeleton = () => (
  <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
    <div
      className="glass-panel shimmer"
      style={{ height: '240px', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}
    />
    <div
      className="shimmer"
      style={{ height: '30px', width: '200px', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}
    />
    <CardGridSkeleton count={3} />
  </div>
);

export const TripDetailSkeleton = () => (
  <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>
    <div
      className="shimmer"
      style={{
        height: '420px',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '2rem',
      }}
    />
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
      }}
    >
      <div className="glass-panel shimmer" style={{ height: '260px' }} />
      <div className="glass-panel shimmer" style={{ height: '360px' }} />
    </div>
  </div>
);

export const GallerySkeleton = ({ count = 4 }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
      gap: '1rem',
    }}
  >
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="shimmer"
        style={{ height: '160px', borderRadius: 'var(--radius-md)' }}
      />
    ))}
  </div>
);

export const PageSkeleton = () => (
  <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem', width: '100%' }}>
    <div className="shimmer" style={{ height: '48px', width: '280px', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }} />
    <div className="shimmer" style={{ height: '24px', width: '180px', borderRadius: 'var(--radius-sm)', marginBottom: '3rem' }} />
    <CardGridSkeleton count={6} />
  </div>
);
