import React, { useState } from 'react';
import { Home, Search, ClipboardList, Menu, X, LogOut, User, Building2 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentNavLinks = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Find PGs', path: '/listings', icon: <Search size={18} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <ClipboardList size={18} /> },
    { name: 'Custom Requirements', path: '/requirements', icon: <ClipboardList size={18} /> },
  ];

  // Add Owner Portal link for owners
  const navLinks = user?.role === 'owner'
    ? [...studentNavLinks, { name: 'Owner Portal', path: '/owner/dashboard', icon: <Building2 size={18} /> }]
    : studentNavLinks;

  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      margin: '1rem',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{
          background: 'var(--gradient-primary)',
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.2rem'
        }}>
          MS
        </div>
        <span className="text-xl text-gradient" style={{ fontWeight: 700 }}>MOVStay</span>
      </Link>

      {/* Desktop Nav */}
      <div className="flex gap-6 items-center" style={{ display: 'none' }} id="desktop-nav">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            style={{
              textDecoration: 'none',
              color: location.pathname === link.path ? 'white' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 500,
              transition: 'color 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'white'}
            onMouseOut={(e) => e.currentTarget.style.color = location.pathname === link.path ? 'white' : 'var(--text-muted)'}
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="text-muted text-sm flex items-center gap-1">
              <User size={16} /> {user.name || user.email?.split('@')[0]}
              {user.role === 'owner' && (
                <span style={{
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  fontSize: '0.65rem',
                  padding: '1px 6px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  marginLeft: '4px'
                }}>OWNER</span>
              )}
            </span>
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>Student Login</Link>
            <Link to="/owner/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>Owner Login</Link>
          </div>
        )}
      </div>

      {/* Mobile Nav Toggle */}
      <button
        className="btn-outline"
        style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', display: 'block' }}
        id="mobile-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Basic responsive CSS block for navbar */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media (min-width: 768px) {
          #desktop-nav { display: flex !important; }
          #mobile-toggle { display: none !important; }
        }
      `}} />

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="glass-panel flex-col" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '0.5rem',
          padding: '1rem',
          gap: '1rem',
          zIndex: 40
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              style={{
                textDecoration: 'none',
                color: location.pathname === link.path ? 'white' : 'var(--text-muted)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: location.pathname === link.path ? 'var(--bg-glass)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          {!user && (
            <>
              <Link to="/owner/login" style={{
                textDecoration: 'none', color: 'var(--text-muted)',
                padding: '0.75rem', borderRadius: 'var(--radius-sm)',
                display: 'flex', alignItems: 'center', gap: '0.75rem'
              }} onClick={() => setIsMobileMenuOpen(false)}>
                <Building2 size={18} /> Owner Login
              </Link>
            </>
          )}
          {user && (
            <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.75rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <LogOut size={18} /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
