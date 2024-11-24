import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Register.module.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://new-projectwildlife.onrender.com/api/auth/register', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/login');
      }
    } catch (error) {
      setError('Registration failed. Try again.');
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <h2>Create Your Account</h2>
        <p>Join us in protecting wildlife and making a difference!</p>
        <form onSubmit={handleRegister} className={styles.registerForm}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputField}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.inputField}
            required
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submitButton}>
            Register
          </button>
        </form>
        <p className={styles.loginText}>
          Already have an account? <a href="/login" className={styles.loginLink}>Log In</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
