"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { p2pTransfer } from "../actions/transcation";

export default function P2PTransfer() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const quickSendAmounts = [100, 500, 1000, 2000, 5000];

  const handleQuickSend = (value: number) => {
    setAmount(value);
    setError("");
  };

  const handleTransfer = async () => {
    if (!username.trim() || !amount || amount <= 0) {
      setError("Please enter a valid username and amount.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const response = await p2pTransfer(username, amount);

      if (!response.success) {
        throw new Error(
          response.message || "Transfer failed. Please try again."
        );
      }

      alert(`₹${amount} sent to @${username} successfully!`);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error processing transfer:", error);
      setError(error.message || "An error occurred while sending money.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 py-12 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-6 border border-blue-200">
        <h2 className="text-2xl font-semibold text-center text-blue-900">
          P2P Money Transfer
        </h2>
        <p className="text-center text-blue-600 mb-6">
          Send money securely to friends & family
        </p>

        {error && (
          <p className="text-center text-red-600 font-medium">{error}</p>
        )}

        {/* Username Input */}
        <div className="mb-4">
          <label className="block text-blue-700 font-medium mb-1">
            Username (@handle)
          </label>
          <input
            type="text"
            className="w-full border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="block text-blue-700 font-medium mb-1">Amount</label>
          <input
            type="number"
            className="w-full border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter amount (₹)"
            value={amount || ""}
            onChange={(e) => setAmount(Number(e.target.value) || null)}
          />
        </div>

        {/* Quick Send Buttons */}
        <div className="mb-6">
          <p className="text-blue-700 font-medium mb-2">Quick Send:</p>
          <div className="flex space-x-2">
            {quickSendAmounts.map((value) => (
              <button
                key={value}
                className={`px-4 py-2 rounded-lg transition ${
                  amount === value
                    ? "bg-blue-600 text-white"
                    : "bg-blue-200 text-blue-900 hover:bg-blue-300"
                }`}
                onClick={() => handleQuickSend(value)}
              >
                ₹{value}
              </button>
            ))}
          </div>
        </div>

        <button
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-200 disabled:opacity-50"
          onClick={handleTransfer}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "🚀 Send Money"}
        </button>
      </div>
    </div>
  );
}
