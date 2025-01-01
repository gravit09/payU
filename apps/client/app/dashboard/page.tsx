import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1>This is a protected route</h1>
      <p>Welcome, {session.user?.name || "Guest"}!</p>
      <p>{JSON.stringify(session)}</p>
    </div>
  );
}
