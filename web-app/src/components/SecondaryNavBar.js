import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/SecondaryNavBar.css';

const SecondaryNavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <div className="container">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/wildlife-sightings">
              Wildlife Sightings
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/tourism">
              Tourism
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/donations">
              Donations
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default SecondaryNavBar;
