import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MainNavBar.css'; // Import CSS styles

const MainNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
        {/* Navbar brand */}
        <Link to="/" className="navbar-brand">
          <img src="/assets/home-icon.png" alt="Home" height="30" />
          <span className="navbar-text">Easy at Home</span>
        </Link>

        {/* Navbar links */}
        <div className="ms-auto">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact-us" className="nav-link">Contact Us</Link>
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;
