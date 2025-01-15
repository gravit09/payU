import type { NextApiRequest, NextApiResponse } from "next";

const WEBHOOK_SECRET =
  process.env.WEBHOOK_SECRET || "your-webhook-secret-token";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const receivedToken = req.headers["x-webhook-token"];

  if (receivedToken !== WEBHOOK_SECRET) {
    return res.status(403).json({ message: "Forbidden: Invalid Token" });
  }

  const { userId, amount, status } = req.body;

  if (status === "success") {
    console.log(`User ${userId} topped up wallet with ₹${amount}`);
    res.status(200).json({ message: "Wallet top-up successful!" });
  } else {
    res.status(400).json({ message: "Payment failed!" });
  }
}
