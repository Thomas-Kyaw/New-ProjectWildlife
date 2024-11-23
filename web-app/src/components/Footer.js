import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <div>
          <h4>Contact Information</h4>
          <ul>
            <li>Email: info@orangutanoasis.com</li>
            <li>Phone: +123 456 7890</li>
          </ul>
        </div>
        <div>
          <h4>Social Media</h4>
          <ul>
            <li><a href="#facebook">Facebook</a></li>
            <li><a href="#twitter">Twitter</a></li>
            <li><a href="#instagram">Instagram</a></li>
          </ul>
        </div>
        <div>
          <h4>Other Links</h4>
          <ul>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <p>© 2024 Orangutan Oasis. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
