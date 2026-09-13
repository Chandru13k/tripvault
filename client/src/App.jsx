import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TripDetail from './pages/TripDetail';
import PublicProfile from './pages/PublicProfile';
import EditProfile from './pages/EditProfile';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastProvider } from './components/Toast';

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
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });

  // Listen for changes to localStorage (e.g. login/logout from within pages)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
      try {
        setUser(JSON.parse(localStorage.getItem('user')));
      } catch {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem('token');
      if (currentToken !== token) {
        setToken(currentToken);
        try {
          setUser(JSON.parse(localStorage.getItem('user')));
        } catch {
          setUser(null);
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [token]);

  return (
    <ToastProvider>
      <Router>
        {/* Navigation Bar */}
        <Navbar token={token} user={user} setToken={setToken} />

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
            <Route 
              path="/trips/:id" 
              element={
                <ProtectedRoute>
                  <TripDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit-profile" 
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              } 
            />
            <Route path="/profile/:username" element={<PublicProfile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </Router>
    </ToastProvider>
  );
}

export default App;

