"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { verifySignedPayload } from "../api/actions/route";

export default function Payment() {
  const router = useRouter();
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [payload, setPayload] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  useEffect(() => {
    async function initialize() {
      try {
        const session = await getSession();
        if (session?.user?.app !== "bank") {
          const returnUrl = encodeURIComponent(window.location.href);
          router.push(`/login?returnUrl=${returnUrl}`);
          return;
        }
        const urlParams = new URLSearchParams(window.location.search);
        const payloadParam = urlParams.get("payload");
        const signatureParam = urlParams.get("signature");

        if (!payloadParam || !signatureParam) {
          setIsValid(false);
          return;
        }
        const verifiedPayload = await verifySignedPayload(
          payloadParam,
          signatureParam
        );
        if (!verifiedPayload) {
          setIsValid(false);
          return;
        }
        setIsValid(true);
        setPayload(payloadParam);
        setSignature(signatureParam);
        setAmount(verifiedPayload.amount);
      } catch (error) {
        console.error("Error verifying payment:", error);
        setIsValid(false);
      }
    }

    initialize();
  }, [router]);

  const handlePayment = async (accept: boolean) => {
    if (!payload || !signature) {
      alert("Missing payment details.");
      return;
    }

    if (!accept) {
      alert("Payment rejected.");
      router.push("/dashboard");
      return;
    }

    try {
      const response = await fetch("/api/actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload, signature }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Payment failed: ${data.message || "Unknown error"}`);
        return;
      }

      alert(`Payment successful!`);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("An error occurred while processing the payment.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 py-12 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-6 border border-blue-200">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-center text-blue-900">
          Payment Verification
        </h2>
        <p className="text-center text-blue-600 mb-6">
          Securely confirm your transaction
        </p>

        {/* Verification State */}
        {isValid === null && (
          <p className="text-center text-blue-500">
            Verifying payment request...
          </p>
        )}
        {isValid === false && (
          <p className="text-center text-red-600 font-medium">
            Invalid payment request. Please try again.
          </p>
        )}

        {/* Payment Details */}
        {isValid === true && amount !== null && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-center">
            <p className="text-lg font-medium text-blue-700">Payment Amount</p>
            <p className="text-3xl font-bold text-blue-900">₹{amount}</p>
          </div>
        )}
        {isValid === true && amount === null && (
          <p className="text-center text-gray-600 mt-4">Amount not found.</p>
        )}

        {/* Buttons */}
        <div className="flex flex-col space-y-3">
          <button
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePayment(true)}
            disabled={!isValid}
          >
            ✅ Accept
          </button>
          <button
            className="w-full bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-400 focus:ring-4 focus:ring-gray-300 transition duration-200"
            onClick={() => handlePayment(false)}
          >
            ❌ Reject
          </button>
        </div>
      </div>
    </div>
  );
}
