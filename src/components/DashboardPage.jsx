import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BarChart3, CreditCard, Send, DollarSign, LogOut } from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [balanceError, setBalanceError] = useState("");
  const [transactionError, setTransactionError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/login");
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

    if (email) {
      fetchBalance();
      fetchTransactions();
    } else {
      setBalanceError("Please create an account");
    }
  }, [email]);

  const handleNavigation = (page) => {
    setActiveTab(page);
    if (page === "dashboard") {
      navigate("/home/dashboard");
    } else if (page === "deposit") {
      navigate("/home/deposit");
    } else if (page === "withdraw") {
      navigate("/home/withdraw");
    } else if (page === "transfer") {
      navigate("/home/transfer");
    } else if (page === "apply-card") {
      navigate("/home/apply-card");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-teal-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Left side (miraBank) */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-sky-600">miraBank</h1>
          </div>

          {/* Right side (Avatar and Logout) */}
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage
                src="/placeholder.svg?height=32&width=32"
                alt="User"
              />
              <AvatarFallback>{username ? username[0] : "JD"}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700">
              {username}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-sky-600 hover:text-sky-700 hover:bg-sky-50"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar Navigation */}
        <nav className="bg-sky-100 w-64 p-6 hidden md:block">
          <div className="space-y-4">
            {/* Dashboard */}
            <Button
              variant={activeTab === "dashboard" ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "dashboard"
                  ? "bg-sky-200 text-sky-800"
                  : "text-sky-600 hover:bg-sky-200 hover:text-sky-800"
              }`}
              onClick={() => handleNavigation("dashboard")}
            >
              <BarChart3 className="h-5 w-5 mr-3" />
              Dashboard
            </Button>

            {/* Deposit */}
            <Button
              variant={activeTab === "deposit" ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "deposit"
                  ? "bg-sky-200 text-sky-800"
                  : "text-sky-600 hover:bg-sky-200 hover:text-sky-800"
              }`}
              onClick={() => handleNavigation("deposit")}
            >
              <DollarSign className="h-5 w-5 mr-3" />
              Deposit
            </Button>

            {/* Withdraw */}
            <Button
              variant={activeTab === "withdraw" ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "withdraw"
                  ? "bg-sky-200 text-sky-800"
                  : "text-sky-600 hover:bg-sky-200 hover:text-sky-800"
              }`}
              onClick={() => handleNavigation("withdraw")}
            >
              <DollarSign className="h-5 w-5 mr-3" />
              Withdraw
            </Button>

            {/* Transfer */}
            <Button
              variant={activeTab === "transfer" ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "transfer"
                  ? "bg-sky-200 text-sky-800"
                  : "text-sky-600 hover:bg-sky-200 hover:text-sky-800"
              }`}
              onClick={() => handleNavigation("transfer")}
            >
              <Send className="h-5 w-5 mr-3" />
              Transfer
            </Button>

            {/* Apply for Card */}
            <Button
              variant={activeTab === "apply-card" ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "apply-card"
                  ? "bg-sky-200 text-sky-800"
                  : "text-sky-600 hover:bg-sky-200 hover:text-sky-800"
              }`}
              onClick={() => handleNavigation("apply-card")}
            >
              <CreditCard className="h-5 w-5 mr-3" />
              Apply for Card
            </Button>
          </div>
        </nav>
        <div className="w-full p-6">
          {/* Render nested routes */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
