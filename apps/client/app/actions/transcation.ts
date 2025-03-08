"use server";
import db from "@repo/db/client";
import { getServerSession } from "next-auth";
import crypto from "crypto";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";

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

export async function p2pTransfer(username: string, amount: number) {
  if (amount <= 0) {
    throw new Error(
      "❌ Invalid transfer amount. Amount must be greater than zero."
    );
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("🚫 Unauthenticated request. Please log in.");
  }

  const senderId = session.user.id;

  // Fetch sender
  const sender = await db.user.findUnique({
    where: { id: senderId },
  });

  if (!sender) {
    throw new Error("⚠️ Sender not found. Please try again.");
  }

  if (sender.Balance < amount) {
    throw new Error("💰 Insufficient balance. You don’t have enough funds.");
  }

  // Fetch receiver
  const receiver = await db.user.findFirst({
    where: {
      username: { equals: username, mode: "insensitive" },
    },
  });

  if (!receiver) {
    throw new Error(
      `❌ Receiver "${username}" not found. Please check the username.`
    );
  }

  if (receiver.id === senderId) {
    throw new Error("⚠️ You cannot send money to yourself.");
  }

  try {
    await db.$transaction([
      db.$queryRaw`SELECT * FROM "User" WHERE "id" = ${senderId} FOR UPDATE`, // this line of code is used to lock the balance
      db.user.update({
        where: { id: senderId },
        data: { Balance: { decrement: amount } },
      }),

      db.user.update({
        where: { id: receiver.id },
        data: { Balance: { increment: amount } },
      }),

      db.p2PTransaction.create({
        data: {
          senderId,
          receiverId: receiver.id,
          amount,
          status: "PENDING",
        },
      }),
    ]);
    return {
      success: true,
      message: `✅ ₹${amount} successfully transferred to @${username}!`,
    };
  } catch (error: any) {
    console.error("🔥 P2P Transaction Error:", error);
    throw new Error(
      `❌ Transaction failed: ${error.message || "Unknown error occurred."}`
    );
  }
}
