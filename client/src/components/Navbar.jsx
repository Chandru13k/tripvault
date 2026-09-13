import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from './Toast';

const Navbar = ({ token, user, setToken }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setIsMenuOpen(false);
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <span>🗺️</span> TripVault
        </Link>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className={`nav-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Navigation Menu"
          aria-expanded={isMenuOpen}
        >
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
        </button>

        {/* Navigation Links */}
        <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <li>
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Home
            </Link>
          </li>
          {token ? (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
              </li>
              {user?.username && (
                <li>
                  <Link
                    to={`/profile/${user.username}`}
                    className={`nav-link ${isActive(`/profile/${user.username}`) ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    Public Profile
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to="/edit-profile"
                  className={`nav-link ${isActive('/edit-profile') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Edit Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary nav-btn-logout"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="btn btn-primary nav-btn-register"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
