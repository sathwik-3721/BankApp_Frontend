// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './components/DashboardPage';
import CreateAccountPage from './components/CreateAccountPage';
import DepositPage from './components/DepositPage';
import WithdrawPage from './components/WithdrawPage';
import TransferPage from './components/TransferPage';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import './styles.css'; // Import the CSS file

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />}>
          <Route path="create-account" element={<CreateAccountPage />} />
          <Route path="deposit" element={<DepositPage />} />
          <Route path="withdraw" element={<WithdrawPage />} />
          <Route path="transfer" element={<TransferPage />} />
        </Route>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
};

export default App;
