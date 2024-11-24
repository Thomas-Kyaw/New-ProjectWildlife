import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Home.module.css'; // Import CSS Module

const Home = () => {
  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Explore Semenggoh Nature Reserve</h1>
          <p className={styles.heroSubtitle}>
            Join us in our journey to protect wildlife and promote sustainable tourism.
          </p>
          <Link to="/tourism" className={`btn btn-primary ${styles.heroButton}`}>
            Explore Tourism
          </Link>
        </div>
      </section>

      {/* Informational Section */}
      <section className={styles.infoSection}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <img
                src={require('../assets/Tourism-Image-Card-4.jpeg')}
                alt="Orangutan"
                className="img-fluid rounded"
              />
            </div>
            <div className="col-md-6">
              <h2>About the Sanctuary</h2>
              <p>
                The Semenggoh Nature Reserve is home to a variety of wildlife, particularly the endangered Orangutans.
                We are dedicated to the rehabilitation and protection of these magnificent creatures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className={styles.missionSection}>
        <div className="container text-center">
          <h2>Our Mission</h2>
          <p className="lead">
            Our mission is to protect endangered species, preserve their natural habitats, and educate the public on
            the importance of conservation. Join us in making a difference today!
          </p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4">
              <div className={`${styles.ctaCard} shadow-sm`}>
                <h3>Donate to the Cause</h3>
                <p>Your donations help us continue our work to protect wildlife.</p>
                <Link to="/donations" className="btn btn-primary">
                  Donate
                </Link>
              </div>
            </div>
            <div className="col-md-4">
              <div className={`${styles.ctaCard} shadow-sm`}>
                <h3>Volunteer with Us</h3>
                <p>Join our team of dedicated volunteers and help make a difference.</p>
                <Link to="/volunteer" className="btn btn-primary">
                  Volunteer
                </Link>
              </div>
            </div>
            <div className="col-md-4">
              <div className={`${styles.ctaCard} shadow-sm`}>
                <h3>Spread the Word</h3>
                <p>Help us raise awareness by sharing our mission with others.</p>
                <Link to="/share" className="btn btn-primary">
                  Share
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
