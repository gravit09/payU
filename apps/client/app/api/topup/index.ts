import type { NextApiRequest, NextApiResponse } from "next";
export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { userId, amount } = req.body;
  const bankUrl = `http://localhost:3001/login?token=${userId}&amount=${amount}`;
  res.status(200).json({ url: bankUrl });
}
