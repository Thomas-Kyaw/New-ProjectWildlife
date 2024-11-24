import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/NavBar.module.css';

const NavBar = () => {
  const [showBottomNav, setShowBottomNav] = useState(true);

  // Only hide the bottom navbar when scrolling down
  const handleScroll = () => {
    const currentScroll = window.scrollY;
    setShowBottomNav(currentScroll <= 90); // Bottom navbar hides after scrolling 90px
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Navbar */}
      <nav className={styles.topNavbar}>
        <Link to="/" className={styles.navbarBrand}>
          <img src={require('../assets/main-logo.png')} alt="Home" height="24" />
          Semenggoh Reserve
        </Link>
        <div className={styles.navbarLinks}>
          <Link to="/login" className={styles.navLink}>Login</Link>
          <Link to="/register" className={styles.navLink}>Register</Link>
          <Link to="/about-us" className={styles.navLink}>About</Link>
          <Link to="/contact-us" className={styles.navLink}>Contact Us</Link>
        </div>
      </nav>

      {/* Bottom Navbar */}
      <nav
        className={`${styles.bottomNavbar} ${!showBottomNav ? styles.hidden : ''}`}
      >
        <Link to="/wildlife-sightings" className={styles.navLink}>Wild Life Sightings</Link>
        <Link to="/tourism" className={styles.navLink}>Tourism</Link>
        <Link to="/donations" className={styles.navLink}>Donations</Link>
        <Link to="/upload-image" className={styles.navLink}>Upload Image</Link>
      </nav>
    </>
  );
};

export default NavBar;
