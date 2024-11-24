import React from "react";
import { useForm } from "react-hook-form";
import styles from "../styles/ContactUs.module.css";

const ContactUs = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    alert("Message sent successfully!");
    // Add logic to send form data to an email API here.
  };

  return (
    <div className={styles.contactPage}>
      {/* Contact Form Section */}
      <section className={styles.contactFormSection}>
        <h1>Contact Us</h1>
        <p>
          We'd love to hear from you! Please fill out the form below and we'll
          get in touch with you shortly.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.contactForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <span className={styles.errorMessage}>Name is required</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className={styles.errorMessage}>Email is required</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              placeholder="Enter the subject"
              {...register("subject", { required: true })}
            />
            {errors.subject && (
              <span className={styles.errorMessage}>Subject is required</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows="5"
              placeholder="Enter your message"
              {...register("message", { required: true })}
            ></textarea>
            {errors.message && (
              <span className={styles.errorMessage}>Message is required</span>
            )}
          </div>

          <button type="submit" className={styles.submitButton}>
            Send Message
          </button>
        </form>
      </section>

      {/* Contact Information Section */}
      <section className={styles.contactInfoSection}>
        <div className={styles.contactInfoBox}>
          <h2>Contact Information</h2>
          <p>Email: info@orangutanoasis.com</p>
          <p>Phone: +123 456 7890</p>
          <p>Address: Semenggoh Nature Reserve, Borneo</p>
        </div>

        <div className={styles.socialMediaLinks}>
          <h2>Follow Us</h2>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
