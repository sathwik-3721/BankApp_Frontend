'use client'

import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, ClipboardList, Key, RefreshCw, CreditCard, Eye, EyeOff } from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [balanceError, setBalanceError] = useState("");
  const [transactionError, setTransactionError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [avatarClicked, setAvatarClicked] = useState(false);
  const [accountNumber, setAccountNumber] = useState(null);
  const [accountError, setAccountError] = useState("");
  const [showFullAccountNumber, setShowFullAccountNumber] = useState(false);

  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const toggleAvatarMenu = () => {
    setAvatarClicked(!avatarClicked);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/v1/bank/getBalanceCid/${email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        if (result && result.length > 0 && result[0].balance) {
          setBalance(result[0].balance);
        } else {
          setBalanceError("Please create an account");
        }
      } catch (error) {
        setBalanceError("Error fetching balance. Please create an account.");
      }
    };

    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/v1/bank/getTransactionByMail/${email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        if (result && result.length > 0) {
          setTransactions(result);
        } else {
          setTransactionError("No transactions found.");
        }
      } catch (error) {
        setTransactionError("Error fetching transactions.");
      }
    };

    const fetchAccountNumber = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/v1/bank/getAccnoByMail/${email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        if (result && result.acc_no) {
          // Save the account number to local storage
          localStorage.setItem("accountNumber", result.acc_no);
          setAccountNumber(result.acc_no);
        } else {
          setAccountError("Account number not found.");
        }
      } catch (error) {
        setAccountError("Error fetching account number.");
      }
    };    

    if (email) {
      fetchBalance();
      fetchTransactions();
      fetchAccountNumber();
    } else {
      setBalanceError("Please create an account");
    }
  }, [email]);

  const maskAndGroupAccountNumber = (accNo) => {
    if (!accNo) return "";
    const maskedPart = accNo.slice(0, -4).replace(/\d/g, "*");
    const visiblePart = accNo.slice(-4);
    const groupedMaskedPart = maskedPart.match(/.{1,4}/g).join(" ");
    return `${groupedMaskedPart} ${visiblePart}`;
  };

  const handleNavigation = (page) => {
    setActiveTab(page);
    navigate(`/home/${page}`);
  };

  const toggleAccountNumberVisibility = () => {
    setShowFullAccountNumber(!showFullAccountNumber);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-teal-50 flex flex-col">
      <header className="bg-white shadow-sm relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-sky-600">miraBank</h1>
          </div>

          <div className="relative">
            <img
              src={`https://avatar.iran.liara.run/username?username=${username?.replace(
                " ",
                "+"
              ) || "User"}`}
              alt="Avatar"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={toggleAvatarMenu}
            />
            {avatarClicked && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
                <div className="p-4">
                  <div className="text-gray-700 font-semibold">{username}</div>
                  <button
                    onClick={handleLogout}
                    className="mt-2 w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-300"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        <nav className="bg-sky-100 w-64 p-6 hidden md:block">
          <div className="space-y-4">
            <Button
              variant={activeTab === "dashboard" ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "dashboard"
                  ? "bg-sky-600 text-sky-200 hover:text-sky-800"
                  : "text-sky-600 bg-sky-200 hover:text-sky-800"
              }`}
              onClick={() => handleNavigation("dashboard")}
            >
              <BarChart3 className="h-5 w-5 mr-3" />
              Dashboard
            </Button>

            <Button
              variant={activeTab === "transactions" ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "transactions"
                  ? "bg-sky-600 text-sky-200 hover:text-sky-800"
                  : "text-sky-600 bg-sky-200 hover:text-sky-800"
              }`}
              onClick={() => handleNavigation("transactions")}
            >
              <ClipboardList className="h-5 w-5 mr-3" />
              Transactions
            </Button>

            <Button
              variant={activeTab === "generate-pin" ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "generate-pin"
                  ? "bg-sky-600 text-sky-200 hover:text-sky-800"
                  : "text-sky-600 bg-sky-200 hover:text-sky-800"
              }`}
              onClick={() => handleNavigation("generate-pin")}
            >
              <Key className="h-5 w-5 mr-3" />
              Generate PIN
            </Button>

            <Button
              variant={activeTab === "update-pin" ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "update-pin"
                  ? "bg-sky-600 text-sky-800 hover:text-sky-800"
                  : "text-sky-600 bg-sky-200 hover:text-sky-800"
              }`}
              onClick={() => handleNavigation("update-pin")}
            >
              <RefreshCw className="h-5 w-5 mr-3" />
              Update PIN
            </Button>

            <Button
              variant={activeTab === "card-details" ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "card-details"
                  ? "bg-sky-600 text-sky-200 hover:text-sky-800"
                  : "text-sky-600 bg-sky-200 hover:text-sky-800"
              }`}
              onClick={() => handleNavigation("card-details")}
            >
              <CreditCard className="h-5 w-5 mr-3" />
              Card Details
            </Button>
          </div>
        </nav>
        <div className="w-full p-6 relative z-0">
          {accountNumber ? (
            <div className="mb-6 text-lg font-semibold text-sky-600 flex items-center">
              <span>Account Number: </span>
                <span className="ml-2">
                  {showFullAccountNumber
                    ? accountNumber
                    : maskAndGroupAccountNumber(accountNumber)}
                </span>
            <button
              onClick={toggleAccountNumberVisibility}
              className="ml-2 p-1 flex items-center justify-center bg-blue-500 rounded-full focus:outline-none hover:bg-blue-600 transition-colors"
              aria-label={showFullAccountNumber ? "Hide account number" : "Show full account number"}
            >
              {showFullAccountNumber ? (
                <EyeOff className="h-5 w-5 text-white" />
              ) : (
                <Eye className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
          
          ) : (
            <div className="mb-6 text-lg font-semibold text-red-600">
              {accountError}
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
}