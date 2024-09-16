// src/components/WithdrawPage.jsx
import React, { useState } from 'react';
import '../styles.css'; // Import the CSS file for styling

const WithdrawPage = () => {
  const [formData, setFormData] = useState({
    account_number: '',
    amount: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Log or send the data to your API endpoint
    console.log('Withdraw details:', formData);

    // Sample API call using fetch
    fetch('http://localhost:8000/v1/bank/withdraw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Withdrawal successful:', data);
        // Handle success (e.g., display a message, clear form, etc.)
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle error (e.g., display an error message)
      });
  };

  return (
    <div className="withdraw-container">
      <h2>Withdraw Money</h2>
      <form onSubmit={handleSubmit} className="withdraw-form">
        <div className="form-group">
          <label>Account Number:</label>
          <input
            type="text"
            name="account_number"
            value={formData.account_number}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">Withdraw</button>
      </form>
    </div>
  );
};

export default WithdrawPage;
