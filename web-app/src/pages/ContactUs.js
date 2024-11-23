import React from "react";
import { useForm } from "react-hook-form";
import "../styles/ContactUs.css";

const ContactUs = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    alert("Message sent successfully!");
    // You can add logic to send form data to an email API here.
  };

  return (
    <div className="contact-page">
      {/* Contact Form Section */}
      <section className="contact-form-section">
        <h1>Contact Us</h1>
        <p>
          We'd love to hear from you! Please fill out the form below and we'll
          get in touch with you shortly.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <span className="error-message">Name is required</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="error-message">Email is required</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              placeholder="Enter the subject"
              {...register("subject", { required: true })}
            />
            {errors.subject && (
              <span className="error-message">Subject is required</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows="5"
              placeholder="Enter your message"
              {...register("message", { required: true })}
            ></textarea>
            {errors.message && (
              <span className="error-message">Message is required</span>
            )}
          </div>

          <button type="submit" className="submit-button">
            Send Message
          </button>
        </form>
      </section>

      {/* Contact Information Section */}
      <section className="contact-info-section">
        <div className="contact-info-box">
          <h2>Contact Information</h2>
          <p>Email: info@orangutanoasis.com</p>
          <p>Phone: +123 456 7890</p>
          <p>Address: Semenggoh Nature Reserve, Borneo</p>
        </div>

        <div className="social-media-links">
          <h2>Follow Us</h2>
          <a href="facebook.com">Facebook</a>
          <a href="twitter.com">Twitter</a>
          <a href="instagram.com">Instagram</a>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
