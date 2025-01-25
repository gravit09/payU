"use client";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { acceptPayment } from "../api/actions/route";

export default function Payment() {
  const router = useRouter();
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    async function checkSession() {
      const session = await getSession();
      console.log(session);
      if (session?.user.app !== "bank") {
        router.push("/login");
      }
    }
    checkSession();
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
          <div className="text-center flex text-green-600">
            <p className="text-lg">
              Payment request of <strong>{amount}</strong> Rupees is valid.
            </p>
          </div>
        )}
        <div className="m-auto flex text-center ">
          <button
            onClick={() => acceptPayment(Number(amount))}
            className="ml-5 p-2 rounded bg-green-400 text-white"
          >
            Accept
          </button>
          <button className="ml-5 p-2 rounded bg-red-400 text-white">
            Reject
          </button>
        </div>
        {isValid === true && amount === null && (
          <p className="text-center text-gray-600">Amount not found.</p>
        )}
      </div>
    </div>
  );
}
