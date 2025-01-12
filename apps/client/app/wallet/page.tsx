"use client";

import { useState } from "react";
import { Card } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Wallet, ArrowUpCircle, Clock } from "lucide-react";

const banks = [
  { id: 1, name: "Chase Bank" },
  { id: 2, name: "Bank of America" },
  { id: 3, name: "Wells Fargo" },
  { id: 4, name: "Citibank" },
];

const mockTransactions = [
  {
    id: 1,
    type: "deposit",
    amount: 500,
    date: "2024-03-20",
    bank: "Chase Bank",
  },
  {
    id: 2,
    type: "deposit",
    amount: 1000,
    date: "2024-03-19",
    bank: "Bank of America",
  },
  {
    id: 3,
    type: "deposit",
    amount: 250,
    date: "2024-03-18",
    bank: "Wells Fargo",
  },
];

export default function TransactionsPage() {
  const [balance, setBalance] = useState(1750);
  const [amount, setAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [transactions, setTransactions] = useState(mockTransactions);

  const handleDeposit = () => {
    if (!amount || !selectedBank) return;

    const newTransaction = {
      id: transactions.length + 1,
      type: "deposit",
      amount: parseFloat(amount),
      date: new Date().toISOString().split("T")[0] ?? "",
      bank: selectedBank,
    };

    setTransactions([newTransaction, ...transactions]);
    setBalance((prev) => prev + parseFloat(amount));
    setAmount("");
    setSelectedBank("");
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Wallet Section */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Wallet className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Your Wallet</h2>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
          </div>

          <div className="space-y-4">
            <div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Select Bank
                </label>
                <select
                  className="w-full p-2 border rounded"
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                >
                  <option value="">Select a bank</option>
                  {banks.map((bank) => (
                    <option key={bank.id} value={bank.name}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Amount</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
              />
            </div>
            <button
              className="w-full p-2 bg-primary text-white rounded"
              onClick={handleDeposit}
              disabled={!amount || !selectedBank}
            >
              <ArrowUpCircle className="w-4 h-4 mr-2 inline" />
              Add Money
            </button>
          </div>
        </Card>

        {/* Transaction History */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Transaction History</h2>
          </div>

          <div className="h-[400px] overflow-y-auto">
            <div className="space-y-4 pr-4">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        Added money from {transaction.bank}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.date}
                      </p>
                    </div>
                    <p className="font-semibold text-green-600">
                      +${transaction.amount.toFixed(2)}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
