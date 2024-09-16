// src/components/CreateAccountPage.jsx
import React, { useState } from 'react';
import '../styles.css'; // Import the CSS file

const CreateAccountPage = () => {
  const [formData, setFormData] = useState({
    customer_id: '',
    balance: '',
    account_type: '',
    email: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="create-account-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} className="create-account-form">
        <div className="form-group">
          <label>Customer ID:</label>
          <input
            type="text"
            name="customer_id"
            value={formData.customer_id}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Balance:</label>
          <input
            type="number"
            name="balance"
            value={formData.balance}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Account Type:</label>
          <input
            type="text"
            name="account_type"
            value={formData.account_type}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">Create Account</button>
      </form>
    </div>
  );
};

export default CreateAccountPage;
