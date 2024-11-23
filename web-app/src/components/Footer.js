import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4">
      <div className="container">
        <div className="row">
          {/* Contact Information */}
          <div className="col-md-4 mb-3">
            <h5>Contact Information</h5>
            <ul className="list-unstyled">
              <li>Email: info@orangutanoasis.com</li>
              <li>Phone: +123 456 7890</li>
            </ul>
          </div>
          {/* Social Media */}
          <div className="col-md-4 mb-3">
            <h5>Social Media</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#facebook" className="text-white text-decoration-none">Facebook</a>
              </li>
              <li>
                <a href="#twitter" className="text-white text-decoration-none">Twitter</a>
              </li>
              <li>
                <a href="#instagram" className="text-white text-decoration-none">Instagram</a>
              </li>
            </ul>
          </div>
          {/* Other Links */}
          <div className="col-md-4 mb-3">
            <h5>Other Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#faq" className="text-white text-decoration-none">FAQ</a>
              </li>
              <li>
                <a href="#terms" className="text-white text-decoration-none">Terms of Service</a>
              </li>
              <li>
                <a href="#privacy" className="text-white text-decoration-none">Privacy Policy</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-3">
          <p>© 2024 Orangutan Oasis. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
