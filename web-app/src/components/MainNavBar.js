import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/MainNavBar.css';

const MainNavBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <nav className={`main-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="main-nav-logo">
        <Link to="/">LOGO</Link> 
      </div>
      <ul className="main-nav-links">
        <li><Link to="/about-us">About Us</Link></li>
        <li><Link to="/contact-us">Contact Us</Link></li>
        <li><Link to="/login">Login</Link></li> {/* Link to login page */}
        <li><Link to="/upload-image">Upload Image</Link></li>
      </ul>
    </nav>
  );
};

export default MainNavBar;
