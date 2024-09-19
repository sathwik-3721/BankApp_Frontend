import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DashBoardComponent = () => {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [balanceError, setBalanceError] = useState("");
  const [transactionError, setTransactionError] = useState("");
  const [showBalance, setShowBalance] = useState(true);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [isApplyCardDialogOpen, setIsApplyCardDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [cardAccountNumber, setCardAccountNumber] = useState("");
  const [cardType, setCardType] = useState("");

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!email) {
      setBalanceError("Please create an account");
      return;
    }

    const fetchBalance = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/v1/bank/getBalanceCid/${email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        console.log("Balance result", result);

        if (result && result.length > 0 && result[0].balance) {
          setBalance(result[0].balance);
        } else {
          setBalanceError("No balance found");
        }
      } catch (error) {
        setBalanceError("Error fetching balance. Please create an account.");
        console.error(error);
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
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        console.log("Transaction result", result);

        if (result && result.length > 0) {
          const sortedTransactions = result.sort(
            (a, b) =>
              new Date(b.transaction_date) - new Date(a.transaction_date)
          );
          const latestTransactions = sortedTransactions.slice(0, 4);
          setTransactions(latestTransactions);
        } else {
          setTransactionError("No transactions found.");
        }
      } catch (error) {
        setTransactionError("Error fetching transactions.");
        console.error(error);
      }
    };

    const fetchUserName = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/v1/bank/getUserName/${email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user name");
        }

        const result = await response.json();
        setUserName(result.name);
      } catch (error) {
        console.error("Error fetching user name", error);
      }
    };

    fetchBalance();
    fetchTransactions();
    fetchUserName();
  }, [email, token]);

  const handleQuickAction = (action) => {
    if (action === "transfer") {
      setIsTransferDialogOpen(true);
    } else if (action === "applyCard") {
      setIsApplyCardDialogOpen(true);
    } else {
      console.log(`${action} action to be implemented`);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8000/v1/bank/transferMoney",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            from_account_number: fromAccount,
            to_account_number: toAccount,
            amount: parseFloat(amount),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Transfer failed");
      }

      const result = await response.json();
      setDialogMessage(result.message);
      setIsSuccessDialogOpen(true);

      // Update balance and transactions
      setBalance((prevBalance) => prevBalance - parseFloat(amount));
      const newTransaction = {
        transaction_id: transactions.length + 1,
        transaction_type: "transfer",
        amount: parseFloat(amount),
        transaction_date: new Date().toISOString(),
        from_account_number: fromAccount,
        to_account_number: toAccount,
      };
      setTransactions([newTransaction, ...transactions.slice(0, 3)]);

      // Close the dialog and reset form
      setIsTransferDialogOpen(false);
      setFromAccount("");
      setToAccount("");
      setAmount("");
    } catch (error) {
      console.error("Error:", error);
      setDialogMessage("Transfer failed. Please try again.");
      setIsErrorDialogOpen(true);
    }
  };

  const handleApplyCard = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8000/v1/bank/applyForCard",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            account_number: cardAccountNumber,
            card_type: cardType,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Card application failed");
      }

      const result = await response.json();
      setDialogMessage(result.message);
      setIsSuccessDialogOpen(true);

      // Close the dialog and reset form
      setIsApplyCardDialogOpen(false);
      setCardAccountNumber("");
      setCardType("");
    } catch (error) {
      console.error("Error:", error);
      setDialogMessage("Card application failed. Please try again.");
      setIsErrorDialogOpen(true);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <header className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg py-4 px-6 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-semibold text-blue-900">Dashboard</div>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-blue-900">
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {balanceError ? (
                <div className="text-red-500">{balanceError}</div>
              ) : (
                <div className="flex items-center gap-2 text-3xl font-bold text-blue-700">
                  {showBalance
                    ? `$${balance !== null ? balance.toFixed(2) : "Loading..."}`
                    : "****"}
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-1 rounded-full bg-blue-500 hover:bg-blue-600 focus:outline-none"
                    aria-label={showBalance ? "Hide balance" : "Show balance"}
                  >
                    <EyeIcon className="w-5 h-5 text-white" />
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-900">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button
                onClick={() => handleQuickAction("transfer")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="mr-2 h-4 w-4" /> Transfer
              </Button>
              <Button
                onClick={() => handleQuickAction("applyCard")}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <CreditCard className="mr-2 h-4 w-4" /> Apply Card
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blue-900">
              Latest Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="font-semibold text-blue-900">
                    Type
                  </TableCell>
                  <TableCell className="font-semibold text-blue-900">
                    Date & Time
                  </TableCell>
                  <TableCell className="font-semibold text-blue-900">
                    Amount
                  </TableCell>
                  <TableCell className="font-semibold text-blue-900">
                    From
                  </TableCell>
                  <TableCell className="font-semibold text-blue-900">
                    To
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.transaction_id}>
                      <TableCell className="font-medium text-blue-800">
                        {transaction.transaction_type.charAt(0).toUpperCase() +
                          transaction.transaction_type.slice(1)}
                      </TableCell>
                      <TableCell className="text-blue-700">
                        {formatDateTime(transaction.transaction_date)}
                      </TableCell>
                      <TableCell className="font-medium text-blue-800">
                        ${transaction.amount}
                      </TableCell>
                      <TableCell className="text-blue-700">
                        {transaction.transaction_type === "transfer"
                          ? transaction.from_account_number
                          : "-"}
                      </TableCell>
                      <TableCell className="text-blue-700">
                        {transaction.transaction_type === "transfer"
                          ? transaction.to_account_number
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-blue-700"
                    >
                      No transactions available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {transactionError && (
              <div className="text-red-500 mt-4">{transactionError}</div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Transfer Dialog */}
      <Dialog
        open={isTransferDialogOpen}
        onOpenChange={setIsTransferDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-blue-100 to-blue-300 bg-opacity-90 backdrop-filter backdrop-blur-lg border border-blue-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-blue-900">
              Transfer Money
            </DialogTitle>
            <DialogDescription className="text-blue-700">
              Enter the details for your transfer below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTransfer} className="space-y-4">
            <div>
              <Label
                htmlFor="fromAccount"
                className="text-blue-900 font-semibold"
              >
                From Account
              </Label>
              <Input
                id="fromAccount"
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
                placeholder="Enter source account"
                required
                className="bg-white bg-opacity-50 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <Label
                htmlFor="toAccount"
                className="text-blue-900 font-semibold"
              >
                To Account
              </Label>
              <Input
                id="toAccount"
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                placeholder="Enter destination account"
                required
                className="bg-white bg-opacity-50 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <Label htmlFor="amount" className="text-blue-900 font-semibold">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
                min="0.01"
                step="0.01"
                className="bg-white bg-opacity-50 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
              Transfer
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Apply Card Dialog */}
      <Dialog
        open={isApplyCardDialogOpen}
        onOpenChange={setIsApplyCardDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-blue-100 to-blue-300 bg-opacity-90 backdrop-filter backdrop-blur-lg border border-blue-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-blue-900">
              Apply for Card
            </DialogTitle>
            <DialogDescription className="text-blue-700">
              Enter the details for your card application below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleApplyCard} className="space-y-4">
            <div>
              <Label
                htmlFor="cardAccountNumber"
                className="text-blue-900 font-semibold"
              >
                Account Number
              </Label>
              <Input
                id="cardAccountNumber"
                value={cardAccountNumber}
                onChange={(e) => setCardAccountNumber(e.target.value)}
                placeholder="Enter account number"
                required
                className="bg-white bg-opacity-50 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <Label htmlFor="cardType" className="text-blue-900 font-semibold">
                Card Type
              </Label>
              <Select value={cardType} onValueChange={setCardType} required>
                <SelectTrigger className="bg-white bg-opacity-50 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                  <SelectValue placeholder="Select card type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debit">Debit Card</SelectItem>
                  <SelectItem value="credit">Credit Card</SelectItem>
                  <SelectItem value="prepaid">Prepaid Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
              Apply for Card
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-green-100 to-green-300 bg-opacity-90 backdrop-filter backdrop-blur-lg border border-green-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-green-900">
              Success
            </DialogTitle>
            <DialogDescription className="text-green-700">
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setIsSuccessDialogOpen(false)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-red-100 to-red-300 bg-opacity-90 backdrop-filter backdrop-blur-lg border border-red-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-red-900">
              Error
            </DialogTitle>
            <DialogDescription className="text-red-700">
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setIsErrorDialogOpen(false)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashBoardComponent;

function EyeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
}