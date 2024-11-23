import React from 'react';
import '../styles/Tourism.css';
import { Link } from 'react-router-dom';

const Tourism = () => {
  return (
    <div className="tourism-page">
      {/* Hero Section */}
      <section className="tourism-hero-section">
        <div className="tourism-hero-content">
          <h1>Explore Semenggoh Nature Reserve</h1>
          <Link to="/book-tour" className="tourism-hero-button">Book Now</Link>
        </div>
      </section>

      {/* Awesome Sanctuary Section */}
      <section className="sanctuary-overview">
        <div className="overview-text">
          <h2>AWESOME SANCTUARY</h2>
          <p>2K+ Orangutans | 500+ Acres of Forest | 100+ Species of Wildlife</p>
          <Link to="/about-us" className="overview-button">Read More</Link>
        </div>
        <div className="overview-images">
          <img src={require('../assets/team-photo.jpg')} alt="Sanctuary" />
          <img src={require('../assets/team-photo.jpg')} alt="Sanctuary Wildlife" />
        </div>
      </section>

      {/* Discover Section */}
      <section className="discover-section">
        <h2>Discover Semenggoh</h2>
        <div className="discover-content">
          <div className="discover-text">
            <p>
              The Semenggoh Nature Reserve offers a diverse range of wildlife, including the rare and endangered orangutans.
              Visit to learn about sustainable tourism and efforts in wildlife rehabilitation.
            </p>
            <Link to="/wildlife-sightings" className="discover-button">Discover More</Link>
          </div>
          <div className="discover-video">
            {/* Add video or video preview image */}
            <img src={require('../assets/team-photo.jpg')} alt="Discover Video" />
          </div>
        </div>
      </section>

      {/* Popular Tours Section */}
      <section className="popular-tours">
        <h2>Popular Tours</h2>
        <div className="tour-cards">
          <div className="tour-card">
            <img src={require('../assets/team-photo.jpg')} alt="Tour 1" />
            <h3>Forest Trek</h3>
            <p>Discover the wonders of the jungle on our guided forest trek.</p>
            <Link to="/tours/forest-trek" className="tour-button">View Tour</Link>
          </div>
          <div className="tour-card">
            <img src={require('../assets/team-photo.jpg')} alt="Tour 2" />
            <h3>Wildlife Safari</h3>
            <p>Experience close encounters with wildlife during our safari.</p>
            <Link to="/tours/wildlife-safari" className="tour-button">View Tour</Link>
          </div>
          <div className="tour-card">
            <img src={require('../assets/team-photo.jpg')} alt="Tour 3" />
            <h3>Orangutan Encounter</h3>
            <p>Meet the famous orangutans in their natural habitat.</p>
            <Link to="/tours/orangutan-encounter" className="tour-button">View Tour</Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <h2>Reviews</h2>
        <div className="review-cards">
          <div className="review-card">
            <h3>Forest Trek Tour</h3>
            <p>“Amazing experience! The guide was excellent, and we saw so much wildlife.”</p>
            <p>- John D.</p>
          </div>
          <div className="review-card">
            <h3>Orangutan Encounter</h3>
            <p>“The highlight of my trip! Seeing the orangutans up close was magical.”</p>
            <p>- Sarah W.</p>
          </div>
          <div className="review-card">
            <h3>Wildlife Safari</h3>
            <p>“A must-do for nature lovers. We saw elephants, birds, and of course, orangutans!”</p>
            <p>- Alex M.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tourism;
