// src/components/TransferPage.jsx
import React, { useState } from 'react';
import '../styles.css'; // Import the CSS file for styling

const TransferPage = () => {
  const [formData, setFormData] = useState({
    from_account_number: '',
    to_account_number: '',
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
    console.log('Transfer details:', formData);

    // Sample API call using fetch
    fetch('http://localhost:8000/v1/bank/transferMoney', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Transfer successful:', data);
        // Handle success (e.g., display a message, clear form, etc.)
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle error (e.g., display an error message)
      });
  };

  return (
    <div className="transfer-container">
      <h2>Transfer Money</h2>
      <form onSubmit={handleSubmit} className="transfer-form">
        <div className="form-group">
          <label>From Account Number:</label>
          <input
            type="text"
            name="from_account_number"
            value={formData.from_account_number}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>To Account Number:</label>
          <input
            type="text"
            name="to_account_number"
            value={formData.to_account_number}
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

        <button type="submit" className="submit-button">Transfer</button>
      </form>
    </div>
  );
};

export default TransferPage;
