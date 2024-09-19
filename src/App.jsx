import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from "./SignUpPage";
import LoginPage from "./LoginPage";
import ForgotPasswordPage from "./ForgotPasswordPage"; 
import DashboardPage from "./components/DashboardPage";
import CreateAccountPage from "./components/CreateAccountPage";
import GeneratePinPage from "./components/GeneratePinPage";
import UpdatePinPage from "./components/UpdatePinPage";
import TransactionsPage from "./components/TransactionsPage";
import DashBoardComponent from "./components/DashBoardComponent";
import CardDetailsPage from "./components/CardDetailsPage";
import "./index.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<DashboardPage />}>
          <Route path="dashboard" element={<DashBoardComponent />} />
          <Route path="generate-pin" element={<GeneratePinPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="update-pin" element={<UpdatePinPage />} />
          <Route path="card-details" element={<CardDetailsPage />} />
        </Route>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} /> 
      </Routes>
    </Router>
  );
};

export default App;
