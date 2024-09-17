import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./components/DashboardPage";
import CreateAccountPage from "./components/CreateAccountPage";
import DepositPage from "./components/DepositPage";
import WithdrawPage from "./components/WithdrawPage";
import TransferPage from "./components/TransferPage";
import ApplyCardPage from "./components/ApplyCardPage";
import GeneratePIN from "./components/GeneratePin";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";
import "./index.css";
import DashBoardComponent from "./components/DashBoardComponent";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<DashboardPage />}>
          <Route path="dashboard" element={<DashBoardComponent />} />
          <Route path="deposit" element={<DepositPage />} />
          <Route path="withdraw" element={<WithdrawPage />} />
          <Route path="transfer" element={<TransferPage />} />
          <Route path="apply-card" element={<ApplyCardPage />} />
          <Route path="generate-pin" element={<GeneratePIN />} />
        </Route>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />{" "}
        {/* Top-level route */}
      </Routes>
    </Router>
  );
};

export default App;
