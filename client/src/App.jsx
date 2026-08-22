import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Landing Page Component
const Landing = () => {
  const token = localStorage.getItem('token');
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '75vh',
      textAlign: 'center',
      padding: '2rem 1rem'
    }} className="animate-fade-in">
      <div style={{ maxWidth: '800px' }}>
        <span style={{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          color: '#fff',
          padding: '0.4rem 1rem',
          borderRadius: '50px',
          fontSize: '0.875rem',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)'
        }}>
          Introducing TripVault 🌍
        </span>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 800,
          marginTop: '1.5rem',
          marginBottom: '1rem',
          lineHeight: '1.2',
          background: 'linear-gradient(135deg, #ffffff 30%, #94a3b8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Your Personal Travel Journal, Vaulted Securely.
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1.25rem',
          maxWidth: '600px',
          margin: '0 auto 2.5rem auto',
          lineHeight: '1.6'
        }}>
          Document your wanderlust. Keep track of destinations, pin memories, and share your visual stories with friends and family.
        </p>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {token ? (
            <Link to="/dashboard" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '0.875rem 2rem' }}>
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '0.875rem 2rem' }}>
                Get Started for Free
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '0.875rem 2rem' }}>
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Listen for changes to localStorage (e.g. login/logout from within pages)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    // Polling backup because direct window.location redirects don't trigger the storage event on the same tab
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem('token');
      if (currentToken !== token) {
        setToken(currentToken);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [token]);

  return (
    <Router>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="container navbar-container">
          <Link to="/" className="logo">
            <span>🗺️</span> TripVault
          </Link>
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link">Home</Link>
            </li>
            {token ? (
              <>
                <li>
                  <Link to="/dashboard" className="nav-link">Dashboard</Link>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      setToken(null);
                      window.location.href = '/login';
                    }}
                    className="btn btn-secondary" 
                    style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '2rem 0',
        textAlign: 'center',
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-muted)',
        fontSize: '0.875rem'
      }}>
        <div className="container">
          <p>© {new Date().getFullYear()} TripVault. Made with ❤️ for MERN Full Stack Internship.</p>
        </div>
      </footer>
    </Router>
  );
}

export default App;
