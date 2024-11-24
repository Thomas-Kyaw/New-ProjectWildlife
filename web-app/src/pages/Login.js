import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://new-projectwildlife.onrender.com/api/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);

        // Decode token to check role
        const decodedToken = JSON.parse(atob(response.data.token.split('.')[1]));
        if (decodedToken.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      }
    } catch (error) {
      setError('Login failed. Invalid credentials.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2>Welcome Back</h2>
        <p>Please log in to continue</p>
        <form onSubmit={handleLogin} className={styles.loginForm}>
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
            Login
          </button>
        </form>
        <p className={styles.registerText}>
          Don’t have an account? <a href="/register" className={styles.registerLink}>Register Here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
