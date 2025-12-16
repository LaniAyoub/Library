import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/books', label: 'All Books', icon: '📚' },
    { path: '/books/new', label: 'Add Book', icon: '➕' },
    { path: '/search', label: 'Search', icon: '🔍' },
    { path: '/authors', label: 'Authors', icon: '✍️' },
    { path: '/publishers', label: 'Publishers', icon: '🏢' },
    { path: '/inventory', label: 'Inventory', icon: '📊' },
    { path: '/admin/price-update', label: 'Price Update', icon: '💰' },
  ];

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">
            <Link to="/">📖 Library Management</Link>
          </h1>
          
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>

          <nav className={`nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="main">
        {children}
      </main>
      <footer className="footer">
        <p>© 2025 Library Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
