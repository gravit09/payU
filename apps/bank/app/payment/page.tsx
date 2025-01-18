"use client";
import { useEffect, useState } from "react";

export default function Payment() {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const payload = urlParams.get("payload");
      const signature = urlParams.get("signature");

      if (payload && signature) {
        try {
          const response = await fetch("/api/actions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ payload, signature }),
          });

          const data = await response.json();

          if (data.success) {
            setIsValid(true);
            setAmount(data.amount);
          } else {
            setIsValid(false);
          }
        } catch {
          setIsValid(false);
        }
      } else {
        setIsValid(false);
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-3xl font-semibold text-center text-indigo-600 mb-6">
          Welcome to the Payment Page
        </h1>

        {isValid === null && (
          <p className="text-center text-gray-600">
            Verifying payment request...
          </p>
        )}

        {isValid === false && (
          <div className="text-center text-red-600">
            <p>Invalid payment request. Please try again.</p>
          </div>
        )}

        {isValid === true && amount !== null && (
          <div className="text-center text-green-600">
            <p className="text-lg">
              Payment request of <strong>{amount}</strong> USD is valid.
            </p>
          </div>
        )}

        {isValid === true && amount === null && (
          <p className="text-center text-gray-600">Amount not found.</p>
        )}
      </div>
    </div>
  );
}
