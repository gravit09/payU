"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Wallet, ArrowUpCircle, Clock } from "lucide-react";

const banks = [
  { id: 1, name: "Chase Bank" },
  { id: 2, name: "Bank of America" },
];

const mockTransactions = [
  {
    id: 1,
    type: "deposit",
    amount: 500,
    date: "2024-03-20",
    bank: "Chase Bank",
  },
];

export default function TransactionsPage() {
  const [balance, setBalance] = useState(1750);
  const [amount, setAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [transactions, setTransactions] = useState(mockTransactions);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if the user is not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Show a loading state while session is being fetched
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // Extract user ID from the session
  const userId = session?.user?.id;

  const handleTopUp = async () => {
    const response = await fetch("/api/topup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, userId }),
    });

    const data = await response.json();
    window.location.href = data.url;
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Wallet Card */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Wallet className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Your Wallet</h2>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p className="text-3xl font-bold">₹{balance.toFixed(2)}</p>
          </div>

          <div className="space-y-4">
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
              onClick={handleTopUp}
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
                      +₹{transaction.amount.toFixed(2)}
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
