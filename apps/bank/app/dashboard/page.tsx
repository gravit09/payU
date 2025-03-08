import db from "@repo/db/client";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { addMoney } from "../api/actions/route";
import InteractiveSection from "../(component)/page";

export default async function Dashboard() {
  const yojanas: string[] = [
    "2000 rupees received for ladle bhen yojana",
    "Ye 2000 rupees sidha apke bank khate mai ,kya karega itne dhan rashi ka",
    "2000 rupees received from ladla bhai yojana, Why should girls have all the fun",
  ];

  const session = await getServerSession(authOptions);

  if (!session || session.user.app !== "bank") {
    redirect("/login");
  }

  const userId = session.user.id;

  try {
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
          {/* User Info */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold">
              Hello, {user.name || "User"}!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Your balance is:</p>
            <p className="text-3xl font-bold text-blue-600">
              {formattedBalance}
            </p>
          </div>

          {/* Interactive Section */}
          <InteractiveSection yojanas={yojanas} addMoney={addMoney} />

          {/* Transaction History */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold">Transaction History</h2>
            <ul className="mt-4 space-y-2">
              {user.transactions.length > 0 ? (
                user.transactions.map((txn: any) => (
                  <li
                    key={txn.id}
                    className="border-b border-gray-300 dark:border-gray-700 pb-2"
                  >
                    {txn.type === "DEPOSIT" ? "+" : "-"}₹{txn.amount / 100} on{" "}
                    {new Date(txn.createdAt).toLocaleDateString()}
                  </li>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  No transactions available.
                </p>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    return <p>Failed to load user data. Please try again later.</p>;
  }
}
