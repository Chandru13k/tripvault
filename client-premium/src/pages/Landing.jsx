import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  MapPin,
  Calendar,
  Star,
  BookOpen,
  Globe,
  Camera,
  Layers,
  Share2,
  ChevronRight,
  X,
  ChevronLeft,
} from 'lucide-react';
import {
  HERO_BG,
  EDITORIAL_MAIN,
  EDITORIAL_STORY_1,
  EDITORIAL_STORY_2,
  EDITORIAL_STORY_3,
  DESTINATIONS,
  FEATURED_MEMORIES,
} from '../config/images';
import MagneticButton from '../components/MagneticButton';
import DestinationModal from '../components/DestinationModal';
import StoryModal from '../components/StoryModal';

const JOURNEY_PROGRESSION = [
  {
    id: 1,
    destination: 'Kyoto, Japan',
    title: 'Cherry Blossom & Temple Reflections',
    dates: 'Apr 2025',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=85',
    photosCount: 18,
    highlight: 'Kiyomizu-dera early morning mist and bamboo grove walk.',
  },
  {
    id: 2,
    destination: 'Swiss Alps, Switzerland',
    title: 'Alpine Summit & Glacial Treks',
    dates: 'Jun 2025',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=85',
    photosCount: 14,
    highlight: 'Matterhorn view from Zermatt valley trail.',
  },
  {
    id: 3,
    destination: 'Amalfi Coast, Italy',
    title: 'Cliffside Villages & Tyrrhenian Sea',
    dates: 'Aug 2025',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=85',
    photosCount: 24,
    highlight: 'Positano lemon grove path overlooking crystal bay.',
  },
  {
    id: 4,
    destination: 'Bali, Indonesia',
    title: 'Tropical Rice Terraces & Coastal Sunsets',
    dates: 'Nov 2025',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=85',
    photosCount: 16,
    highlight: 'Ubud dawn reflections over rice terraces.',
  },
];

const Landing = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Mouse Parallax Offset
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  // Modals & Active States
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(null);
  const [activeTimelineStep, setActiveTimelineStep] = useState(0);

  // Card 3D Tilt handler
  const [cardTilts, setCardTilts] = useState({});

  useEffect(() => {
    let animationFrameId;

    const handleMouseMove = (e) => {
      if (window.matchMedia('(pointer: coarse)').matches) return;
      animationFrameId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 16;
        const y = (e.clientY / window.innerHeight - 0.5) * 16;
        setMouseOffset({ x, y });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleCardTilt = (idx, e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (y / (rect.height / 2)) * -3.5;
    const rotateY = (x / (rect.width / 2)) * 3.5;
    setCardTilts((prev) => ({ ...prev, [idx]: { rotateX, rotateY } }));
  };

  const handleCardTiltReset = (idx) => {
    setCardTilts((prev) => ({ ...prev, [idx]: { rotateX: 0, rotateY: 0 } }));
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="animate-fade-in">
      {/* 1. LAYERED INTERACTIVE CINEMATIC HERO */}
      <section
        ref={heroRef}
        style={{
          position: 'relative',
          minHeight: '94vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '8rem 1.5rem 5rem 1.5rem',
        }}
      >
        {/* Layer 1: Background Landscape with Parallax */}
        <div
          style={{
            position: 'absolute',
            inset: '-20px',
            backgroundImage: `url(${HERO_BG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
            transform: `translate3d(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px, 0) scale(1.05)`,
            transition: 'transform 0.1s ease-out',
            willChange: 'transform',
          }}
        />

        {/* Layer 2: Atmospheric Vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(13, 17, 23, 0.65) 0%, rgba(13, 17, 23, 0.4) 50%, rgba(13, 17, 23, 0.95) 100%), radial-gradient(circle at center, transparent 30%, rgba(13, 17, 23, 0.8) 100%)',
            zIndex: 1,
          }}
        />

        <div
          style={{
            maxWidth: '1280px',
            width: '100%',
            margin: '0 auto',
            position: 'relative',
            zIndex: 2,
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '3.5rem',
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          {/* Headline & Layer 4-6 */}
          <div
            style={{
              transform: `translate3d(${mouseOffset.x * -0.3}px, ${mouseOffset.y * -0.3}px, 0)`,
              transition: 'transform 0.12s ease-out',
            }}
          >
            <div className="travel-badge" style={{ marginBottom: '1.5rem' }}>
              <Compass size={14} color="var(--accent-terracotta)" /> CINEMATIC TRAVEL JOURNAL
            </div>

            <h1 className="heading-hero" style={{ marginBottom: '1.5rem', color: '#ffffff' }}>
              Every Journey<br />
              <span style={{ fontStyle: 'italic', color: 'var(--accent-sand)' }}>
                Deserves To Be Remembered.
              </span>
            </h1>

            <p
              style={{
                color: 'rgba(255, 255, 255, 0.88)',
                fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
                maxWidth: '560px',
                marginBottom: '2.5rem',
                lineHeight: 1.65,
                fontWeight: 400,
              }}
            >
              Capture your trips, preserve your memories, and share the places that shaped your wanderlust.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {token ? (
                <MagneticButton
                  className="btn-cinematic"
                  style={{ fontSize: '1.05rem', padding: '0.95rem 2.2rem' }}
                  onClick={() => navigate('/dashboard')}
                  dataCursor="JOURNAL →"
                >
                  <BookOpen size={18} /> Open My Journal <ArrowRight size={18} />
                </MagneticButton>
              ) : (
                <>
                  <MagneticButton
                    className="btn-cinematic"
                    style={{ fontSize: '1.05rem', padding: '0.95rem 2.2rem' }}
                    onClick={() => navigate('/register')}
                    dataCursor="JOIN →"
                  >
                    Start Your Vault — Free <ArrowRight size={18} />
                  </MagneticButton>
                  <MagneticButton
                    className="btn-editorial-outline"
                    style={{ fontSize: '1.05rem', padding: '0.95rem 2.2rem' }}
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </MagneticButton>
                </>
              )}
            </div>
          </div>

          {/* Layer 7: Interactive Floating Snapshot Cards */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              alignItems: 'center',
              transform: `translate3d(${mouseOffset.x * 0.6}px, ${mouseOffset.y * 0.6}px, 0)`,
              transition: 'transform 0.15s ease-out',
            }}
            className="hero-floating-cards"
          >
            {/* Top Floating Card */}
            <div
              className="card-editorial animate-slide-up floating-card-1"
              data-cursor="VIEW →"
              onClick={() => setSelectedDestination(DESTINATIONS[2])}
              style={{
                width: '320px',
                padding: '0.85rem',
                background: 'rgba(22, 27, 34, 0.92)',
                transform: 'rotate(-3deg) translateX(-20px)',
                boxShadow: 'var(--shadow-photo)',
                cursor: 'pointer',
              }}
            >
              <img
                src={EDITORIAL_STORY_1}
                alt="Cinque Terre Memory"
                className="card-ratio-16-9"
                style={{ borderRadius: 'var(--radius-sm)' }}
              />
              <div style={{ padding: '0.75rem 0.25rem 0.25rem 0.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '1rem', color: '#fff', fontFamily: 'var(--font-editorial)' }}>Cinque Terre Cliffside</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>★ 5.0</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '2px' }}>
                  <MapPin size={12} color="var(--accent-terracotta)" /> Italy • Logged 2025
                </div>
              </div>
            </div>

            {/* Bottom Floating Card */}
            <div
              className="card-editorial animate-slide-up floating-card-2"
              data-cursor="VIEW →"
              onClick={() => setSelectedDestination(DESTINATIONS[1])}
              style={{
                width: '300px',
                padding: '0.85rem',
                background: 'rgba(22, 27, 34, 0.94)',
                transform: 'rotate(4deg) translateX(30px) translateY(-20px)',
                boxShadow: 'var(--shadow-photo)',
                animationDelay: '0.15s',
                cursor: 'pointer',
              }}
            >
              <img
                src={EDITORIAL_STORY_3}
                alt="Emerald Lake Memory"
                className="card-ratio-16-9"
                style={{ borderRadius: 'var(--radius-sm)' }}
              />
              <div style={{ padding: '0.75rem 0.25rem 0.25rem 0.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.95rem', color: '#fff', fontFamily: 'var(--font-editorial)' }}>Alpine Emerald Waters</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-sand)' }}>14 Photos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE PHILOSOPHY STRIP */}
      <section
        style={{
          background: 'rgba(22, 27, 34, 0.85)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '2.5rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
          }}
        >
          <div style={{ padding: '0.5rem' }}>
            <Globe size={28} color="var(--accent-terracotta)" style={{ marginBottom: '0.75rem' }} />
            <div style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.35rem', color: '#fff' }}>1. EXPLORE</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Discover destinations across continents & cultures.
            </p>
          </div>

          <div style={{ padding: '0.5rem' }}>
            <Compass size={28} color="var(--accent-sand)" style={{ marginBottom: '0.75rem' }} />
            <div style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.35rem', color: '#fff' }}>2. JOURNEY</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Document itinerary dates, notes, and experience ratings.
            </p>
          </div>

          <div style={{ padding: '0.5rem' }}>
            <Camera size={28} color="var(--accent-ocean)" style={{ marginBottom: '0.75rem' }} />
            <div style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.35rem', color: '#fff' }}>3. REMEMBER</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Vault high-resolution photographs & visual galleries.
            </p>
          </div>

          <div style={{ padding: '0.5rem' }}>
            <Share2 size={28} color="var(--accent-sage)" style={{ marginBottom: '0.75rem' }} />
            <div style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.35rem', color: '#fff' }}>4. SHARE</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Publish your personal travel handle with friends.
            </p>
          </div>
        </div>
      </section>

      {/* 3. EXPLORE SECTION WITH INTERACTIVE 3D TILT CARDS & OVERLAY */}
      <section
        id="explore"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '6rem 1.5rem',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="label-caps">Explore Destinations</span>
            <h2 className="heading-section" style={{ marginTop: '0.4rem' }}>
              Featured Regions & Global Landmarks
            </h2>
          </div>
          <p style={{ color: 'var(--text-muted)', maxWidth: '420px', fontSize: '0.95rem' }}>
            Click any destination card to reveal detailed memory logs, region stats, and trip highlights.
          </p>
        </div>

        {/* 3D Tilt Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '2rem',
          }}
        >
          {DESTINATIONS.map((dest, idx) => {
            const tilt = cardTilts[idx] || { rotateX: 0, rotateY: 0 };
            return (
              <div
                key={idx}
                className="card-editorial"
                data-cursor="EXPLORE →"
                onClick={() => setSelectedDestination(dest)}
                onMouseMove={(e) => handleCardTilt(idx, e)}
                onMouseLeave={() => handleCardTiltReset(idx)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                  transition: 'transform 0.15s ease-out, border-color 0.3s ease',
                  willChange: 'transform',
                }}
              >
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className={dest.span === 'large' ? 'card-ratio-16-9' : 'card-ratio-4-3'}
                    style={{ transition: 'transform 0.4s ease' }}
                  />
                  <div className="photo-overlay-bottom" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
                  <span
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      zIndex: 2,
                      background: 'rgba(13, 17, 23, 0.85)',
                      backdropFilter: 'blur(8px)',
                      color: 'var(--accent-sand)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-label)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {dest.tag}
                  </span>
                </div>

                <div style={{ padding: '1.5rem', background: 'var(--bg-card)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.45rem', fontFamily: 'var(--font-editorial)', color: '#ffffff', marginBottom: '0.35rem' }}>
                      {dest.name}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <BookOpen size={15} color="var(--accent-terracotta)" /> {dest.memories} Memories Vaulted
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SCROLL-DRIVEN JOURNEY PROGRESSION TIMELINE */}
      <section
        style={{
          background: 'rgba(18, 22, 29, 0.75)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '6rem 1.5rem',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="label-caps">Journey Progression</span>
            <h2 className="heading-section" style={{ marginTop: '0.4rem' }}>
              Your Travel Timeline & Odyssey Routes
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '540px', margin: '0.75rem auto 0 auto', fontSize: '0.975rem' }}>
              Select steps or scroll through to follow how journeys unfold chronologically.
            </p>
          </div>

          {/* Interactive Step Navigator */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '3rem',
              flexWrap: 'wrap',
            }}
          >
            {JOURNEY_PROGRESSION.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setActiveTimelineStep(idx)}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${activeTimelineStep === idx ? 'var(--accent-terracotta)' : 'var(--border-subtle)'}`,
                  background: activeTimelineStep === idx ? 'rgba(217, 107, 67, 0.15)' : 'rgba(22, 27, 34, 0.7)',
                  color: activeTimelineStep === idx ? '#ffffff' : 'var(--text-muted)',
                  fontFamily: 'var(--font-label)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>0{idx + 1}.</span> {step.destination.split(',')[0]}
              </button>
            ))}
          </div>

          {/* Active Journey Detail Card */}
          {JOURNEY_PROGRESSION[activeTimelineStep] && (
            <div
              className="card-editorial animate-fade-in"
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '2.5rem',
                alignItems: 'center',
                padding: '2.5rem',
                background: 'var(--bg-main)',
              }}
            >
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-md)' }}>
                <img
                  src={JOURNEY_PROGRESSION[activeTimelineStep].image}
                  alt={JOURNEY_PROGRESSION[activeTimelineStep].destination}
                  className="card-ratio-16-9"
                />
              </div>

              <div>
                <div className="travel-badge" style={{ marginBottom: '0.75rem' }}>
                  STEP 0{activeTimelineStep + 1} OF 0{JOURNEY_PROGRESSION.length}
                </div>
                <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '2rem', color: '#fff', marginBottom: '0.5rem' }}>
                  {JOURNEY_PROGRESSION[activeTimelineStep].destination}
                </h3>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--accent-sand)', fontWeight: 600, marginBottom: '1rem' }}>
                  {JOURNEY_PROGRESSION[activeTimelineStep].title}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  "{JOURNEY_PROGRESSION[activeTimelineStep].highlight}"
                </p>

                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '1.5rem' }}>
                  <span>📅 {JOURNEY_PROGRESSION[activeTimelineStep].dates}</span>
                  <span>📷 {JOURNEY_PROGRESSION[activeTimelineStep].photosCount} Photos Vaulted</span>
                  <span style={{ color: 'var(--accent-gold)' }}>★ {JOURNEY_PROGRESSION[activeTimelineStep].rating}.0</span>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    disabled={activeTimelineStep === 0}
                    onClick={() => setActiveTimelineStep((prev) => Math.max(0, prev - 1))}
                    className="btn-editorial-outline"
                    style={{ padding: '0.55rem 1rem' }}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <button
                    disabled={activeTimelineStep === JOURNEY_PROGRESSION.length - 1}
                    onClick={() => setActiveTimelineStep((prev) => Math.min(JOURNEY_PROGRESSION.length - 1, prev + 1))}
                    className="btn-cinematic"
                    style={{ padding: '0.55rem 1.25rem' }}
                  >
                    Next Destination <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. INTERACTIVE TRAVEL STORIES SECTION */}
      <section
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '6rem 1.5rem',
          width: '100%',
        }}
      >
        <div style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
          <span className="label-caps">Editorial Narrative</span>
          <h2 className="heading-section" style={{ marginTop: '0.4rem' }}>
            Travel Stories & Written Reflections
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '3rem',
            alignItems: 'center',
          }}
          className="editorial-grid"
        >
          {/* Story Card with Click Overlay */}
          <div
            className="card-editorial"
            data-cursor="READ STORY →"
            onClick={() => setStoryModalOpen(true)}
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            <img src={EDITORIAL_MAIN} alt="Ocean Odyssey" className="card-ratio-16-9" style={{ minHeight: '440px' }} />
            <div className="photo-overlay-bottom" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem', zIndex: 2 }}>
              <span className="travel-badge" style={{ marginBottom: '0.75rem' }}>
                Featured Story
              </span>
              <h3 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-editorial)', color: '#ffffff', marginBottom: '0.5rem' }}>
                Cruising the Tyrrhenian Horizons
              </h3>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.85)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={14} color="var(--accent-terracotta)" /> Positano, Italy • Click to Read Story →
              </div>
            </div>
          </div>

          <div className="card-editorial" style={{ padding: '2.5rem' }}>
            <h4 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.75rem', color: '#fff', marginBottom: '1rem' }}>
              "The scent of lemon groves and salt spray filled the morning air..."
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.975rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Preserve your authentic travel thoughts, local restaurant finds, and trail observations alongside high-resolution galleries. Every trip card acts as your permanent personal memory vault.
            </p>
            <MagneticButton className="btn-cinematic" onClick={() => setStoryModalOpen(true)}>
              <BookOpen size={16} /> Read Full Reflection
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* 6. MEMORIES GALLERY WITH BLURRED LIGHTBOX */}
      <section
        style={{
          background: 'rgba(18, 22, 29, 0.6)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '6rem 1.5rem',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="label-caps">Memories Vault</span>
            <h2 className="heading-section" style={{ marginTop: '0.4rem' }}>
              High-Definition Photography Gallery
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0.5rem auto 0 auto', fontSize: '0.95rem' }}>
              Click any photograph to view in full-screen cinematic lightbox format with backdrop blur.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {FEATURED_MEMORIES.map((photo, idx) => (
              <div
                key={idx}
                className="card-editorial"
                data-cursor="OPEN +"
                style={{
                  position: 'relative',
                  cursor: 'pointer',
                }}
                onClick={() => setActivePhotoIdx(idx)}
              >
                <img src={photo.image} alt={photo.title} className="card-ratio-3-4" />
                <div className="photo-overlay-bottom" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
                <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', right: '1.25rem', zIndex: 2 }}>
                  <h4 style={{ fontSize: '1.1rem', color: '#fff', fontFamily: 'var(--font-editorial)', marginBottom: '2px' }}>
                    {photo.title}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={12} color="var(--accent-terracotta)" /> {photo.location} • {photo.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cinematic Lightbox Modal with Blurred Background Version */}
      {activePhotoIdx !== null && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 5000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
          onClick={() => setActivePhotoIdx(null)}
        >
          {/* Blurred Version of Image Behind It */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${FEATURED_MEMORIES[activePhotoIdx].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(30px) brightness(0.35)',
              transform: 'scale(1.1)',
            }}
          />

          <button
            onClick={() => setActivePhotoIdx(null)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              zIndex: 10,
              background: 'rgba(255, 255, 255, 0.12)',
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

          {/* Prev/Next Controls */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : FEATURED_MEMORIES.length - 1));
            }}
            style={{
              position: 'absolute',
              left: '24px',
              zIndex: 10,
              background: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              borderRadius: '50%',
              width: '46px',
              height: '46px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActivePhotoIdx((prev) => (prev < FEATURED_MEMORIES.length - 1 ? prev + 1 : 0));
            }}
            style={{
              position: 'absolute',
              right: '24px',
              zIndex: 10,
              background: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              borderRadius: '50%',
              width: '46px',
              height: '46px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChevronRight size={24} />
          </button>

          {/* Main Lightbox Content */}
          <div
            style={{
              position: 'relative',
              zIndex: 5,
              maxWidth: '90vw',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={FEATURED_MEMORIES[activePhotoIdx].image}
              alt={FEATURED_MEMORIES[activePhotoIdx].title}
              style={{
                maxWidth: '85vw',
                maxHeight: '75vh',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                objectFit: 'contain',
              }}
            />
            <div
              style={{
                marginTop: '1rem',
                textAlign: 'center',
                background: 'rgba(13, 17, 23, 0.85)',
                backdropFilter: 'blur(10px)',
                padding: '0.75rem 1.75rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <h4 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.2rem', color: '#fff', margin: 0 }}>
                {FEATURED_MEMORIES[activePhotoIdx].title}
              </h4>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', marginTop: '2px' }}>
                <MapPin size={12} color="var(--accent-terracotta)" /> {FEATURED_MEMORIES[activePhotoIdx].location} • {FEATURED_MEMORIES[activePhotoIdx].date}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Destination Overlay Modal */}
      <DestinationModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
      />

      {/* Story Overlay Modal */}
      <StoryModal
        isOpen={storyModalOpen}
        onClose={() => setStoryModalOpen(false)}
      />

      <style>{`
        @keyframes floatCard1 {
          0%, 100% { transform: rotate(-3deg) translate3d(-20px, -4px, 0); }
          50% { transform: rotate(-3deg) translate3d(-20px, 4px, 0); }
        }
        @keyframes floatCard2 {
          0%, 100% { transform: rotate(4deg) translate3d(30px, 3px, 0); }
          50% { transform: rotate(4deg) translate3d(30px, -3px, 0); }
        }
        .floating-card-1 { animation: floatCard1 5s ease-in-out infinite; }
        .floating-card-2 { animation: floatCard2 6s ease-in-out infinite; }

        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-floating-cards { display: none !important; }
          .editorial-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Landing;
