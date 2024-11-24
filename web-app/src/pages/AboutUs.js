import React from 'react';
import styles from '../styles/AboutUs.module.css';

const AboutUs = () => {
  return (
    <div className={styles.aboutPage}>
      {/* Header Section */}
      <section className={styles.headerSection}>
        <h1>About the Orangutan Oasis Sanctuary</h1>
        <p>
          Learn more about our mission and the amazing team working to protect endangered wildlife.
        </p>
      </section>

      {/* Team Section */}
      <section className={styles.teamSection}>
        <div className={styles.imageWrapper}>
          {/* Featured Image */}
          <img
            src={require('../assets/team-photo.jpg')}
            alt="Our Team"
            className={styles.teamImage}
          />
        </div>
        <div className={styles.teamContent}>
          <h2>Meet Our Team</h2>
          <p>
            The dedicated team at the Orangutan Oasis Sanctuary is committed to protecting endangered wildlife,
            preserving their natural habitats, and spreading awareness about the importance of conservation. 
            With expertise ranging from wildlife biology to community outreach, our team works tirelessly to make a difference.
          </p>
          <h3>Our Mission</h3>
          <p>
            Our mission is to rehabilitate and protect endangered orangutans and other wildlife species. We aim to preserve
            the rainforest ecosystem and promote sustainable practices that benefit both animals and local communities.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.valuesSection}>
        <h2>Our Core Values</h2>
        <div className={styles.valuesGrid}>
          <div className={styles.valueBox}>
            <h3>Conservation</h3>
            <p>
              We believe in preserving the natural habitats of endangered species and promoting sustainable practices.
            </p>
          </div>
          <div className={styles.valueBox}>
            <h3>Education</h3>
            <p>
              We educate the public and local communities about the importance of protecting wildlife and their ecosystems.
            </p>
          </div>
          <div className={styles.valueBox}>
            <h3>Community</h3>
            <p>
              We work closely with local communities to create a shared responsibility for the protection of wildlife.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
