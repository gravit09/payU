"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Wallet, ArrowUpCircle, Clock } from "lucide-react";
import {
  topUpWallet,
  getBalance,
  getTranscations,
} from "../actions/transcation";

const banks = [
  { id: 1, name: "HDFC BANK" },
  { id: 2, name: "Bank of America" },
];

type Transaction = {
  id: string;
  status: string;
  token: string;
  provider: string;
  amount: number;
  startTime: Date;
  userId: string;
};

export default function TransactionsPage() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect unauthenticated users to login
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    console.log(session);
    if (status === "authenticated") {
      const fetchBalance = async () => {
        try {
          const balance = await getBalance();
          const fetchedTransactions = await getTranscations();
          setBalance(balance);
          setTransactions(fetchedTransactions);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchBalance();
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

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
              onClick={async () => {
                try {
                  const { bankUrl } = await topUpWallet(
                    Number(amount),
                    selectedBank
                  );
                  window.open(bankUrl, "_blank");
                  const newTransactions = await getTranscations();
                  setTransactions(newTransactions);
                  setAmount("");
                  setSelectedBank("");
                } catch (error) {
                  console.error("Error topping up wallet:", error);
                }
              }}
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
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <Card key={transaction.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          Added money from {transaction.provider}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.startTime).toLocaleDateString()}
                        </p>
                        <p className="font-medium">
                          Status:
                          <span
                            className={
                              transaction.status === "Success"
                                ? "text-green-400"
                                : "text-yellow-400"
                            }
                          >
                            {transaction.status}
                          </span>
                        </p>
                      </div>
                      <p className="font-semibold text-green-600">
                        +₹{transaction.amount.toFixed(2)}
                      </p>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground">No transactions yet.</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
