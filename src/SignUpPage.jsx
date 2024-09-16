import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css'; // Correct import path

const SignUpPage = () => {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    mobile_num: '',
    email: '',
    pancard_num: '',
    dob: '',
    account_type: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [customerId, setCustomerId] = useState(null); // State to store customer_id
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/v1/bank/createCustomer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      setMessage(result.message);
      setCustomerId(result.customer_id); // Store the customer_id in state
    } catch (error) {
      setMessage('Error creating account.');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <div className="form-group">
        <input
          type="text"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          placeholder="First Name"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          placeholder="Last Name"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="mobile_num"
          value={form.mobile_num}
          onChange={handleChange}
          placeholder="Mobile Number"
        />
      </div>
      <div className="form-group">
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="pancard_num"
          value={form.pancard_num}
          onChange={handleChange}
          placeholder="PAN Card Number"
        />
      </div>
      <div className="form-group">
        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
          placeholder="Date of Birth"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="account_type"
          value={form.account_type}
          onChange={handleChange}
          placeholder="Account Type"
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
        />
      </div>
      <div className="form-group">
        <button onClick={handleSubmit}>Sign Up</button>
        <button onClick={handleLoginRedirect}>Login</button>
      </div>
      {message && <p>{message}</p>}
      {customerId && (
        <div>
          <p>Customer ID: {customerId}</p>
          <p>{`{ "message": "${message}", "customer_id": ${customerId} }`}</p>
        </div>
      )}
    </div>
  );
};

export default SignUpPage;
