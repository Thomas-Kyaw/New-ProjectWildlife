import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Tourism.module.css';
import tourismHeroImg from '../assets/Tourism-Image-Card-2.jpg';
import teamPhoto from '../assets/team-photo.jpg';
import ImageCardOne from '../assets/Tourism-Image-Card.jpg'
import ImageCardTwo from '../assets/Tourism-Image-Card-3.avif'
import ImageCardThree from '../assets/Tourism-Image-Card-1.jpeg'
import ImageCardFour from '../assets/Tourism-Image-Card-4.jpeg'
import ImageCardFive from '../assets/Tourism-Image-Card-5.jpg'
import ImageCardSix from '../assets/Tourism-Image-Card-6.webp'

const Tourism = () => {
  return (
    <div className={styles.tourismPage}>
      {/* Hero Section */}
      <section
        className={styles.tourismHeroSection}
        style={{
          backgroundImage: `url(${tourismHeroImg})`,
        }}
      >
        <div className={styles.tourismHeroContent}>
          <h1 className={styles.heroTitle}>Explore Semenggoh Nature Reserve</h1>
          <Link to="/book-tour" className={styles.heroButton}>
            Book Now
          </Link>
        </div>
      </section>

      {/* Awesome Sanctuary Section */}
      <section className={styles.sanctuaryOverview}>
        <div className={styles.overviewText}>
          <h2>Awesome Sanctuary</h2>
          <p>2K+ Orangutans | 500+ Acres of Forest | 100+ Species of Wildlife</p>
          <Link to="/about-us" className={styles.overviewButton}>Read More</Link>
        </div>
        <div className={styles.overviewImages}>
          <img src={ImageCardOne} alt="Sanctuary" />
          <img src={ImageCardTwo} alt="Sanctuary Wildlife" />
        </div>
      </section>

      {/* Discover Section */}
      <section className={styles.discoverSection}>
        <h2>Discover Semenggoh</h2>
        <div className={styles.discoverContent}>
          <div className={styles.discoverText}>
            <p>
              The Semenggoh Nature Reserve offers a diverse range of wildlife, including the rare and endangered
              orangutans. Visit to learn about sustainable tourism and efforts in wildlife rehabilitation.
            </p>
            <Link to="/wildlife-sightings" className={styles.discoverButton}>
              Discover More
            </Link>
          </div>
          <div className={styles.discoverImage}>
            <img src={ImageCardThree} alt="Discover Wildlife" />
          </div>
        </div>
      </section>

      {/* Popular Tours Section */}
      <section className={styles.popularTours}>
        <h2>Popular Tours</h2>
        <div className={styles.tourCards}>
          <div className={styles.tourCard}>
            <img src={ImageCardFour} alt="Forest Trek" />
            <h3>Forest Trek</h3>
            <p>Discover the wonders of the jungle on our guided forest trek.</p>
            <Link to="/tourism" className={styles.tourButton}>
              View Tour
            </Link>
          </div>
          <div className={styles.tourCard}>
            <img src={ImageCardFive} alt="Wildlife Safari" />
            <h3>Wildlife Safari</h3>
            <p>Experience close encounters with wildlife during our safari.</p>
            <Link to="/tourism" className={styles.tourButton}>
              View Tour
            </Link>
          </div>
          <div className={styles.tourCard}>
            <img src={ImageCardSix} alt="Orangutan Encounter" />
            <h3>Orangutan Encounter</h3>
            <p>Meet the famous orangutans in their natural habitat.</p>
            <Link to="/tourism" className={styles.tourButton}>
              View Tour
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className={styles.reviewsSection}>
        <h2>Reviews</h2>
        <div className={styles.reviewCards}>
          <div className={styles.reviewCard}>
            <h3>Forest Trek Tour</h3>
            <p>“Amazing experience! The guide was excellent, and we saw so much wildlife.”</p>
            <p>- John D.</p>
          </div>
          <div className={styles.reviewCard}>
            <h3>Orangutan Encounter</h3>
            <p>“The highlight of my trip! Seeing the orangutans up close was magical.”</p>
            <p>- Sarah W.</p>
          </div>
          <div className={styles.reviewCard}>
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
