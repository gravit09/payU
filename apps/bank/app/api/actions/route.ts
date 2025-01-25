"use server";
import { NextResponse } from "next/server";
import crypto from "crypto";
import db from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const SECRET_KEY = process.env.SECRET_KEY || "defaultSecretKey";
const WEBHOOK_URL =
  process.env.WEBHOOK_URL || "http://localhost:3001/api/webhook";

interface PaymentPayload {
  txnId: string;
  amount: number;
  timestamp: number;
}

export const verifySignedPayload = async (
  payload: string,
  signature: string
): Promise<PaymentPayload | null> => {
  const recreatedSignature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(payload)
    .digest("hex");

  if (recreatedSignature !== signature) {
    return null;
  }

  try {
    return JSON.parse(payload) as PaymentPayload;
  } catch (error) {
    console.error("Error parsing payload:", error);
    return null;
  }
};

async function acceptPayment(userId: string, amount: number) {
  const user = await db.bankUser.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.balance < amount) {
    throw new Error("Insufficient balance");
  }

  const transaction = await db.$transaction([
    db.bankUser.update({
      where: { id: userId },
      data: {
        balance: {
          decrement: amount * 100,
        },
      },
    }),
    db.transaction.create({
      data: {
        id: crypto.randomUUID(),
        type: "WITHDRAWAL",
        amount: amount * 100,
        accountId: userId,
      },
    }),
  ]);

  return transaction[1];
}

export async function POST(req: Request) {
  try {
    const { payload, signature } = await req.json();
    if (!payload || !signature) {
      console.error("Missing payload or signature");
      return NextResponse.json(
        { success: false, message: "Missing payload or signature" },
        { status: 400 }
      );
    }

    const verifiedPayload = await verifySignedPayload(payload, signature);
    if (!verifiedPayload) {
      console.error("Invalid or tampered signature");
      return NextResponse.json(
        { success: false, message: "Invalid or tampered signature" },
        { status: 400 }
      );
    }

    if (Date.now() - verifiedPayload.timestamp > 5 * 60 * 1000) {
      console.error("Payment request has expired");
      return NextResponse.json(
        { success: false, message: "Payment request has expired" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.error("User not authenticated");
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    const transaction = await acceptPayment(
      session.user.id,
      verifiedPayload.amount
    );

    if (!transaction) {
      console.error("Transaction creation failed");
      return NextResponse.json(
        { success: false, message: "Transaction creation failed" },
        { status: 500 }
      );
    }

    console.log("Transaction created successfully:", transaction);

    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-webhook-token":
          process.env.WEBHOOK_SECRET || "your-webhook-secret-token",
      },
      body: JSON.stringify({
        txnId: verifiedPayload.txnId,
        amount: transaction.amount,
        status: "Success",
      }),
    });

    if (!webhookResponse.ok) {
      console.error("Webhook failed:", webhookResponse.status);
      return NextResponse.json(
        { success: true, message: "Transaction processed, but webhook failed" },
        { status: 202 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Transaction processed successfully",
      transaction,
    });
  } catch (error: any) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
