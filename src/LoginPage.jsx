import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css'; // Import the CSS file

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        alert("Check username or password");
        throw new Error('Login failed');
      }

      // Assuming the response contains a success message or token, parse the response
      const result = await response.json();

      // Store the email in localStorage upon successful login
      localStorage.setItem('username', email);   // Store the username
      localStorage.setItem('email', email);      // Store the email for API calls

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <div>
          <a href="/signup">Sign up</a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
