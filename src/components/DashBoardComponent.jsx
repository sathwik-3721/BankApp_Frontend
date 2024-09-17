import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

const DashBoardComponent = () => {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [balanceError, setBalanceError] = useState("");
  const [transactionError, setTransactionError] = useState("");
  const [showBalance, setShowBalance] = useState(true); // State to toggle balance visibility
  const navigate = useNavigate();

  // Get email from local storage
  const email = localStorage.getItem("email");

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
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        console.log("Transaction result", result);

        if (result && result.length > 0) {
          // Sort transactions by date in descending order
          const sortedTransactions = result.sort(
            (a, b) =>
              new Date(b.transaction_date) - new Date(a.transaction_date)
          );
          // Get the latest 4 transactions
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

    fetchBalance();
    fetchTransactions();
  }, [email]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <header className="bg-card py-4 px-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-semibold">Dashboard</div>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">
        {balanceError ? (
          <div className="text-red-500">{balanceError}</div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Current Balance
                </div>
                <div className="flex items-center gap-2 text-2xl font-semibold">
                  {showBalance
                    ? `$${balance !== null ? balance.toFixed(2) : "Loading..."}`
                    : "****"}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setShowBalance(!showBalance)}
                  >
                    <EyeIcon className="w-5 h-5 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Latest Transactions
              </h2>
              <Table className="min-w-full  divide-gray-200">
                <TableHeader>
                  <TableRow>
                    <TableCell className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase ">
                      Type
                    </TableCell>
                    <TableCell className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase ">
                      Date
                    </TableCell>
                    <TableCell className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase ">
                      Amount
                    </TableCell>
                    <TableCell className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase ">
                      From
                    </TableCell>
                    <TableCell className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase ">
                      To
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <TableRow key={transaction.transaction_id}>
                        <TableCell className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {transaction.transaction_type
                            .charAt(0)
                            .toUpperCase() +
                            transaction.transaction_type.slice(1)}
                        </TableCell>
                        <TableCell className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {new Date(
                            transaction.transaction_date
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${transaction.amount}
                        </TableCell>

                        <>
                          <TableCell className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {transaction.transaction_type === "transfer" ? (
                              `${transaction.from_account_number} `
                            ) : (
                              <p className="">-</p>
                            )}
                          </TableCell>
                          <TableCell className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {transaction.transaction_type === "transfer" ? (
                              `${transaction.to_account_number}`
                            ) : (
                              <p className="">-</p>
                            )}
                          </TableCell>
                        </>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan="4"
                        className="px-4 py-2 text-center text-sm text-gray-500"
                      >
                        No transactions available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
        {transactionError && (
          <div className="text-red-500">{transactionError}</div>
        )}
      </main>
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
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
