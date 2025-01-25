"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Payment() {
  const router = useRouter();
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [txnId, setTxnId] = useState<string | null>(null);
  const [payload, setPayload] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  useEffect(() => {
    async function initialize() {
      try {
        const session = await getSession();
        if (session?.user?.app !== "bank") {
          router.push("/login");
          return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const payloadParam = urlParams.get("payload");
        const signatureParam = urlParams.get("signature");
        console.log(signatureParam);
        console.log(payloadParam);

        if (!payloadParam || !signatureParam) {
          setIsValid(false);
          return;
        }

        setPayload(payloadParam);
        setSignature(signatureParam);

        const response = await fetch("/api/actions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payload: payloadParam,
            signature: signatureParam,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setIsValid(true);
          setAmount(data.transaction?.amount || null);
          setTxnId(data.transaction?.id || null);
        } else {
          setIsValid(false);
        }
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-3xl font-semibold text-center text-indigo-600 mb-6">
          Payment Verification
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
              Payment request of <strong>₹{amount}</strong> is valid.
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => handlePayment(true)}
            className="p-2 rounded bg-green-500 text-white"
            disabled={!isValid || !payload || !signature}
          >
            Accept
          </button>
          <button
            onClick={() => handlePayment(false)}
            className="p-2 rounded bg-red-500 text-white"
          >
            Reject
          </button>
        </div>

        {isValid === true && amount === null && (
          <p className="text-center text-gray-600 mt-4">Amount not found.</p>
        )}
      </div>
    </div>
  );
}
