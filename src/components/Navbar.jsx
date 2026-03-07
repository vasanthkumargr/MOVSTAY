import React from 'react';
import { Home, Search, ClipboardList, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Find PGs', path: '/listings', icon: <Search size={18} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <ClipboardList size={18} /> },
    { name: 'Custom Requirements', path: '/requirements', icon: <ClipboardList size={18} /> },
  ];

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
          PG
        </div>
        <span className="text-xl text-gradient" style={{ fontWeight: 700 }}>NextStay</span>
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
        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Login</button>
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
        </div>
      )}
    </nav>
  );
};

export default Navbar;
