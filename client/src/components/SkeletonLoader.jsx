import React from 'react';

export const CardSkeleton = () => (
  <div className="card skeleton-card">
    <div className="skeleton skeleton-media"></div>
    <div className="card-body">
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
      <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
      <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
    </div>
  </div>
);

export const CardGridSkeleton = ({ count = 6 }) => (
  <div className="trip-grid">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const DetailSkeleton = () => (
  <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
    <div className="skeleton skeleton-banner"></div>
    <div className="skeleton skeleton-title" style={{ width: '50%', margin: '1.5rem 0' }}></div>
    <div className="skeleton skeleton-text" style={{ width: '30%' }}></div>
    <div className="skeleton skeleton-text" style={{ width: '90%', height: '80px', marginTop: '1rem' }}></div>
    <div style={{ marginTop: '2rem' }}>
      <div className="skeleton skeleton-title" style={{ width: '30%' }}></div>
      <div className="photo-gallery-grid" style={{ marginTop: '1rem' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton skeleton-gallery-item"></div>
        ))}
      </div>
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
    <div className="skeleton skeleton-profile-header"></div>
    <div className="skeleton skeleton-title" style={{ width: '40%', margin: '1.5rem auto 0 auto' }}></div>
    <div className="skeleton skeleton-text" style={{ width: '60%', margin: '0.5rem auto 2rem auto' }}></div>
    <CardGridSkeleton count={3} />
  </div>
);
