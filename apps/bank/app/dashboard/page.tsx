import db from "@repo/db/client";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const userId = session.user.id;

  const user = await db.bankUser.findUnique({
    where: { id: userId },
    include: { transactions: true },
  });

  if (!user) {
    return <p>User not found.</p>;
  }

  const formattedBalance = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(user.balance / 100);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
      <nav className="bg-blue-600 p-4 text-white">
        <h1 className="text-2xl font-bold">Bank Dashboard</h1>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold">
            Hello, {user.name || "User"}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Your balance is:</p>
          <p className="text-3xl font-bold text-blue-600">{formattedBalance}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold">Transaction History</h2>
          <ul className="mt-4 space-y-2">
            {user.transactions.map((txn) => (
              <li
                key={txn.id}
                className="border-b border-gray-300 dark:border-gray-700 pb-2"
              >
                {txn.type === "DEPOSIT" ? "+" : "-"}₹{txn.amount / 100} on{" "}
                {new Date(txn.createdAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold">Make a Transaction</h2>

          <form
            action="/api/transaction/deposit"
            method="POST"
            className="mt-4"
          >
            <input type="hidden" name="userId" value={user.id} />
            <label className="block mb-2 text-gray-600 dark:text-gray-400">
              Deposit Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              className="w-full p-2 border rounded-md mb-4"
              placeholder="Enter amount"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
            >
              Deposit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
