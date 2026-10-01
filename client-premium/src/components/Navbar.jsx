import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, User, LogOut, Menu, X, PlusCircle, BookOpen, MapPin, Globe } from 'lucide-react';

const Navbar = ({ token, user, setToken, onOpenCreateModal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (setToken) setToken(null);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? '0.75rem 1.5rem' : '1.25rem 2rem',
        background: scrolled ? 'rgba(13, 17, 23, 0.94)' : 'linear-gradient(to bottom, rgba(13, 17, 23, 0.8), transparent)',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Editorial Brand Logo */}
        <Link
          to={token ? '/dashboard' : '/'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid var(--accent-terracotta)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(217, 107, 67, 0.12)',
            }}
          >
            <Compass size={20} color="var(--accent-terracotta)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: 'var(--font-editorial)',
                fontWeight: 700,
                fontSize: '1.4rem',
                letterSpacing: '0.04em',
                color: '#ffffff',
                lineHeight: 1,
              }}
            >
              TRIPVAULT
            </span>
            <span
              style={{
                fontFamily: 'var(--font-label)',
                fontSize: '0.625rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--accent-sand)',
                marginTop: '2px',
              }}
            >
              Personal Travel Journal
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
          }}
          className="desktop-nav"
        >
          <Link
            to="/"
            style={{
              fontFamily: 'var(--font-label)',
              fontSize: '0.9rem',
              fontWeight: isActive('/') ? 700 : 500,
              color: isActive('/') ? '#ffffff' : 'var(--text-muted)',
              transition: 'color 0.2s ease',
            }}
          >
            Explore
          </Link>

          {token ? (
            <>
              <Link
                to="/dashboard"
                style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: '0.9rem',
                  fontWeight: isActive('/dashboard') ? 700 : 500,
                  color: isActive('/dashboard') ? '#ffffff' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <BookOpen size={16} color="var(--accent-terracotta)" />
                My Journeys
              </Link>

              {user?.username && (
                <Link
                  to={`/profile/${user.username}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: isActive(`/profile/${user.username}`) ? '#ffffff' : 'var(--text-muted)',
                    fontFamily: 'var(--font-label)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <User size={15} color="var(--accent-sand)" />
                  @{user.username}
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="btn-editorial-outline"
                style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem' }}
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#ffffff',
                }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-cinematic"
                style={{ padding: '0.55rem 1.35rem', fontSize: '0.875rem' }}
              >
                Get Started
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            padding: '0.4rem',
          }}
          className="mobile-toggle"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="animate-slide-up"
          style={{
            padding: '1.5rem',
            background: 'rgba(13, 17, 23, 0.96)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid var(--border-subtle)',
            marginTop: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.15rem',
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontFamily: 'var(--font-editorial)' }}
          >
            Explore Destinations
          </Link>

          {token ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontFamily: 'var(--font-editorial)' }}
              >
                My Travel Journal
              </Link>

              {user?.username && (
                <Link
                  to={`/profile/${user.username}`}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ fontSize: '1.1rem', color: 'var(--accent-sand)', fontFamily: 'var(--font-editorial)' }}
                >
                  Traveler Profile (@{user.username})
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="btn-danger-glass"
                style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-editorial-outline"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-cinematic"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
