import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/SecondaryNavBar.css'; // Import CSS styles

const BottomNavbar = () => {
  const [visible, setVisible] = useState(true);
  const [showDropdown, setShowDropdown] = useState({
    EASTERN: false,
    WESTERN: false,
    MY_FAVOURITES: false,
  });

  // Scroll behavior
  const handleScroll = () => {
    setVisible(window.scrollY <= 90); // Show/hide navbar based on scroll position
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse enter/leave handlers for dropdowns
  const mouseEnter = (dropdown) => {
    setShowDropdown((prev) => ({ ...prev, [dropdown]: true }));
  };

  const mouseLeave = (dropdown) => {
    setShowDropdown((prev) => ({ ...prev, [dropdown]: false }));
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-light bg-light bottom-navbar ${!visible ? 'hidden' : ''}`}>
      <div className="container-fluid">
        {/* Toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            {/* Search */}
            <li>
              <Link to="/search" className="nav-link">SEARCH</Link>
            </li>

            {/* Eastern Dropdown */}
            <li
              className={`nav-item dropdown ${showDropdown.EASTERN ? 'show' : ''}`}
              onMouseEnter={() => mouseEnter('EASTERN')}
              onMouseLeave={() => mouseLeave('EASTERN')}
            >
              <Link to="/category/eastern" className="nav-link dropdown-toggle">
                EASTERN
              </Link>
              <ul className="dropdown-menu">
                <li><Link to="/category/eastern/chinese" className="dropdown-item">Chinese</Link></li>
                <li><Link to="/category/eastern/japanese" className="dropdown-item">Japanese</Link></li>
                <li><Link to="/category/eastern/korean" className="dropdown-item">Korean</Link></li>
                <li><Link to="/category/eastern/others" className="dropdown-item">Others</Link></li>
              </ul>
            </li>

            {/* Western Dropdown */}
            <li
              className={`nav-item dropdown ${showDropdown.WESTERN ? 'show' : ''}`}
              onMouseEnter={() => mouseEnter('WESTERN')}
              onMouseLeave={() => mouseLeave('WESTERN')}
            >
              <Link to="/category/western" className="nav-link dropdown-toggle">
                WESTERN
              </Link>
              <ul className="dropdown-menu">
                <li><Link to="/category/western/american" className="dropdown-item">American</Link></li>
                <li><Link to="/category/western/european" className="dropdown-item">European</Link></li>
              </ul>
            </li>

            {/* My Favourites */}
            <li
              className={`nav-item dropdown ${showDropdown.MY_FAVOURITES ? 'show' : ''}`}
              onMouseEnter={() => mouseEnter('MY_FAVOURITES')}
              onMouseLeave={() => mouseLeave('MY_FAVOURITES')}
            >
              <Link to="/category/favourites" className="nav-link dropdown-toggle">
                My Favourites
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavbar;
