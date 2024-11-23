import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section text-center text-white d-flex align-items-center">
        <div className="container">
          <h1 className="display-4">Explore Semenggoh Nature Reserve</h1>
          <p className="lead">
            Join us in our journey to protect wildlife and promote sustainable tourism.
          </p>
          <Link to="/tourism" className="btn btn-primary btn-lg mt-3">
            Explore Tourism
          </Link>
        </div>
      </section>

      {/* Informational Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <img
                src={require('../assets/orangutan-background-1.jpg')}
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
              <h3>About the Orangutans</h3>
              <p>
                Orangutans are one of our closest relatives, sharing around 97% of the same DNA. These intelligent
                creatures are native to Borneo and Sumatra, but their population is in decline due to habitat destruction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-5 text-center bg-white">
        <div className="container">
          <h2>Our Mission</h2>
          <p className="lead">
            Our mission is to protect endangered species, preserve their natural habitats, and educate the public on
            the importance of conservation. Join us in making a difference today!
          </p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4">
              <div className="p-4 bg-white rounded shadow-sm">
                <h3>Donate to the Cause</h3>
                <p>Your donations help us continue our work to protect wildlife.</p>
                <Link to="/donations" className="btn btn-primary">
                  Donate
                </Link>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-white rounded shadow-sm">
                <h3>Volunteer with Us</h3>
                <p>Join our team of dedicated volunteers and help make a difference.</p>
                <Link to="/volunteer" className="btn btn-primary">
                  Volunteer
                </Link>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-white rounded shadow-sm">
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
