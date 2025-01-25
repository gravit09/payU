"use server";
import db from "@repo/db/client";
import { getServerSession } from "next-auth";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "../api/auth/[...nextauth]/route";

interface Payload {
  txnId: string;
  amount: number;
  timestamp: number;
}

export async function getBalance() {
  const session = await getServerSession(authOptions);
  const id = session?.user.id;
  const user = await db.user.findUnique({
    where: { id },
  });
  return user?.Balance || 0;
}

export async function getTranscations() {
  const session = await getServerSession(authOptions);
  const id = session?.user.id;
  const transactions = await db.onRampTransaction.findMany({
    where: { userId: id },
  });
  return transactions;
}

function generateToken() {
  const val = Math.random() * 100;
  return val.toString();
}

export async function topUpWallet(amount: number, provider: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthenticated request");
  }

  const userId = session.user?.id;
  if (!userId) {
    throw new Error("Unauthenticated request");
  }

  const userExists = await db.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    throw new Error("User not found");
  }

  const transaction = await db.onRampTransaction.create({
    data: {
      amount,
      provider,
      token: generateToken(),
      status: "Processing",
      startTime: new Date(),
      user: {
        connect: { id: userId },
      },
    },
  });

  const txnId = transaction.id;
  const { payload, signature } = generateSignedPayload(txnId, amount);
  const bankUrl = `http://localhost:3000/payment?payload=${encodeURIComponent(
    payload
  )}&signature=${signature}`;

  return { transaction, bankUrl };
}

const generateSignedPayload = (
  txnId: string,
  amount: number
): { payload: string; signature: string } => {
  const payload: Payload = {
    txnId,
    amount,
    timestamp: Date.now(),
  };

  const payloadString = JSON.stringify(payload);

  const signature = crypto
    .createHmac("sha256", process.env.SECRET_KEY || "defaultSecretKey")
    .update(payloadString)
    .digest("hex");

  return { payload: payloadString, signature };
};
