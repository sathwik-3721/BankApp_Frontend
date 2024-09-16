// src/components/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../styles.css'; // Correct import path

const DashboardPage = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email'); // Assuming email is stored in localStorage
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [balanceError, setBalanceError] = useState('');
  const [transactionError, setTransactionError] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('email'); // Clear email from localStorage on logout
    navigate('/login');
  };

  useEffect(() => {
    // Fetch Balance
    const fetchBalance = async () => {
      try {
        const response = await fetch(`http://localhost:8000/v1/bank/getBalanceCid/${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        console.log("Balance result", result);

        if (result && result.length > 0 && result[0].balance) {
          setBalance(result[0].balance);
        } else {
          setBalanceError('Please create an account');
        }
      } catch (error) {
        setBalanceError('Error fetching balance. Please create an account.');
      }
    };

    // Fetch Transactions
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`http://localhost:8000/v1/bank/getTransactionByMail/${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        console.log("Transaction result", result);

        if (result && result.length > 0) {
          setTransactions(result);
        } else {
          setTransactionError('No transactions found.');
        }
      } catch (error) {
        setTransactionError('Error fetching transactions.');
      }
    };

    if (email) {
      fetchBalance();
      fetchTransactions();
    } else {
      setBalanceError('Please create an account');
    }
  }, [email]);

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="header-content">
          <span className="username">Hello, {username}</span>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <div className="dashboard-body">
        <nav className="sidebar">
          <ul>
            <li>
              <Link to="create-account">Account Creation</Link>
            </li>
            <li>
              <Link to="deposit">Deposit Money</Link>
            </li>
            <li>
              <Link to="withdraw">Withdraw Money</Link>
            </li>
            <li>
              <Link to="transfer">Transfer Money</Link>
            </li>
            <li>
              <Link to="apply-card">Apply for Card</Link> {/* New Link */}
            </li>
            <li>
              <Link to="generate-pin">Generate PIN for Card</Link>
            </li>
          </ul>
        </nav>
        <main className="content">
          <div className="balance-section">
            {balance !== null ? (
              <p>Your balance: ${balance}</p>
            ) : (
              <p>{balanceError}</p>
            )}
          </div>
          
          <div className="transaction-section">
            <h3>Transaction History</h3>
            {transactions.length > 0 ? (
              <ul>
                {transactions.map(transaction => (
                  <li key={transaction.transaction_id}>
                    {transaction.transaction_type === 'deposit' ? 'Deposited ' : 'Withdrew '} 
                    ${transaction.amount} on {new Date(transaction.transaction_date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>{transactionError}</p>
            )}
          </div>
          
          {/* Renders the content of child routes */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
