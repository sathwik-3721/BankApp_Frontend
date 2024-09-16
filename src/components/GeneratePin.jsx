import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css'; // Import your CSS styles

const GeneratePIN = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/v1/bank/generatePIN', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          card_number: cardNumber,
          account_number: accountNumber,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(result.message || 'Pin generated successfully');
        // Optionally redirect after success
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000); // Redirect after 3 seconds
      } else {
        setMessage('Error: Could not generate PIN');
      }
    } catch (error) {
      setMessage('Error: Unable to process your request');
    }
  };

  return (
    <div className="generate-pin-container">
      <h2>Generate PIN</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="accountNumber">Account Number</label>
          <input
            type="text"
            id="accountNumber"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
          />
        </div>
        <button type="submit">Generate PIN</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default GeneratePIN;
