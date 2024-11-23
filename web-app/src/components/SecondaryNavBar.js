import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/SecondaryNavBar.css';

const SecondaryNavBar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const navRef = useRef(null);
  const placeholderRef = useRef(null);

  useEffect(() => {
    const placeholder = placeholderRef.current;
    const obsOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const obsCallback = (entries) => {
      const entry = entries[0];
      setIsSticky(!entry.isIntersecting);
    };

    const observer = new IntersectionObserver(obsCallback, obsOptions);
    if (placeholder) {
      observer.observe(placeholder);
    }

    return () => {
      if (placeholder) {
        observer.unobserve(placeholder);
      }
    };
  }, []);

  return (
    <>
      <div ref={placeholderRef} className="secondary-nav-placeholder"></div>
      <nav ref={navRef} className={`secondary-nav ${isSticky ? 'sticky' : ''}`}>
        <ul className="secondary-nav-links">
          <li><Link to="/wildlife-sightings">Wildlife Sightings</Link></li>
          <li><Link to="/tourism">Tourism</Link></li>
          <li><Link to="/donations">Donations</Link></li>
        </ul>
      </nav>
    </>
  );
};

export default SecondaryNavBar;