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
import { FilterIcon } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TransactionsComponent = () => {
  const [transactions, setTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [transactionError, setTransactionError] = useState("");
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [transactionType, setTransactionType] = useState("all");
  const navigate = useNavigate();

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!email) {
      setTransactionError("Please create an account");
      return;
    }

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
          setTransactions(sortedTransactions);
          setAllTransactions(sortedTransactions);
          setFilteredTransactions(sortedTransactions);
        } else {
          setTransactionError("No transactions found.");
        }
      } catch (error) {
        setTransactionError("Error fetching transactions.");
        console.error(error);
      }
    };

    fetchTransactions();
  }, [email, token]);

  const handleFilter = (e) => {
    e.preventDefault();
    const filtered = allTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.transaction_date);
      const fromDateObj = fromDate ? new Date(fromDate) : null;
      const toDateObj = toDate ? new Date(toDate) : null;

      const dateInRange = (!fromDateObj || transactionDate >= fromDateObj) &&
                          (!toDateObj || transactionDate <= toDateObj);

      const typeMatches = transactionType === 'all' || transaction.transaction_type === transactionType;

      return dateInRange && typeMatches;
    });

    setFilteredTransactions(filtered);
    setIsFilterDialogOpen(false);
  };

  const resetFilter = () => {
    setFromDate("");
    setToDate("");
    setTransactionType("all");
    setFilteredTransactions(allTransactions);
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
          <div className="text-2xl font-semibold text-blue-900">Transactions</div>
        </div>
      </header>
      <main className="flex-1 p-6">
        <Card className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold text-blue-900">All Transactions</CardTitle>
            <Button onClick={() => setIsFilterDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <FilterIcon className="mr-2 h-4 w-4" /> Filter
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="font-semibold text-blue-900">Type</TableCell>
                  <TableCell className="font-semibold text-blue-900">Date & Time</TableCell>
                  <TableCell className="font-semibold text-blue-900">Amount</TableCell>
                  <TableCell className="font-semibold text-blue-900">From</TableCell>
                  <TableCell className="font-semibold text-blue-900">To</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.transaction_id}>
                      <TableCell className="font-medium text-blue-800">
                        {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                      </TableCell>
                      <TableCell className="text-blue-700">
                        {formatDateTime(transaction.transaction_date)}
                      </TableCell>
                      <TableCell className="font-medium text-blue-800">
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-blue-700">
                        {transaction.transaction_type === "transfer" ? transaction.from_account_number : "-"}
                      </TableCell>
                      <TableCell className="text-blue-700">
                        {transaction.transaction_type === "transfer" ? transaction.to_account_number : "-"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-blue-700">
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

      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-blue-100 to-blue-300 bg-opacity-90 backdrop-filter backdrop-blur-lg border border-blue-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-blue-900">Filter Transactions</DialogTitle>
            <DialogDescription className="text-blue-700">
              Set the parameters to filter your transactions.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFilter} className="space-y-4">
            <div>
              <Label htmlFor="fromDate" className="text-blue-900 font-semibold">From Date</Label>
              <Input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-white bg-opacity-50 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <Label htmlFor="toDate" className="text-blue-900 font-semibold">To Date</Label>
              <Input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="bg-white bg-opacity-50 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <Label htmlFor="transactionType" className="text-blue-900 font-semibold">Transaction Type</Label>
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger className="bg-white bg-opacity-50 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
              Apply Filter
            </Button>
            <Button onClick={resetFilter} className="w-full mt-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md">
              Reset Filter
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TransactionsComponent;