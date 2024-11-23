  import React from 'react';
  import '../styles/Home.css';
  import { Link } from 'react-router-dom';

  const Home = () => {
    return (
      <div className="home-page">
        {/* Hero Section with Background Image */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>Explore Semenggoh Nature Reserve</h1>
            <p>Join us in our journey to protect wildlife and promote sustainable tourism.</p>
            <Link to="/tourism" className="hero-button">Explore Tourism</Link>
          </div>
        </section>

        {/* Informational Section */}
        <div className="informational-section">
          <div className="image-wrapper">
            {/* Image of the Orangutan */}
            <img src={require('../assets/orangutan-background-1.jpg')} alt="Orangutan" className="informational-image" />
          </div>
          <div className="info-content">
            <h2>About the Sanctuary</h2>
            <p>
              The Semenggoh Nature Reserve is home to a variety of wildlife, particularly the endangered Orangutans. We are
              dedicated to the rehabilitation and protection of these magnificent creatures.
            </p>
            <h3>About the Orangutans</h3>
            <p>
              Orangutans are one of our closest relatives, sharing around 97% of the same DNA. These intelligent creatures are
              native to Borneo and Sumatra, but their population is in decline due to habitat destruction.
            </p>
          </div>
        </div>

        {/* Other Sections */}
      <div className="main-content">

        {/* Mission Section */}
        <section className="mission-section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to protect endangered species, preserve their natural habitats, and educate the public on the importance 
            of conservation. Join us in making a difference today!
          </p>
        </section>

        {/* Call to Action Buttons Section */}
        <section className="cta-buttons-section">
          <div className="cta-box">
            <h3>Donate to the Cause</h3>
            <p>Your donations help us continue our work to protect wildlife.</p>
            <Link to="/donations" className="cta-button">Donate</Link>
          </div>
          <div className="cta-box">
            <h3>Volunteer with Us</h3>
            <p>Join our team of dedicated volunteers and help make a difference.</p>
            <Link to="/volunteer" className="cta-button">Volunteer</Link>
          </div>
          <div className="cta-box">
            <h3>Spread the Word</h3>
            <p>Help us raise awareness by sharing our mission with others.</p>
            <Link to="/share" className="cta-button">Share</Link>
          </div>
        </section>
      </div>
      </div>
    );
  };

  export default Home;
