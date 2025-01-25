import { NextResponse } from "next/server";
import db from "@repo/db/client";

const WEBHOOK_SECRET =
  process.env.WEBHOOK_SECRET || "your-webhook-secret-token";

export async function POST(req: Request) {
  try {
    const receivedToken = req.headers.get("x-webhook-token");

    if (receivedToken !== WEBHOOK_SECRET) {
      return NextResponse.json(
        { message: "Forbidden: Invalid Token" },
        { status: 403 }
      );
    }

    const { txnId, amount, status } = await req.json();
    if (!txnId || typeof amount !== "number" || !status) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const transaction = await db.onRampTransaction.findUnique({
      where: { id: txnId },
    });

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 402 }
      );
    }

    // Prevent duplicate updates
    if (transaction.status === status) {
      return NextResponse.json(
        { message: "Transaction already updated" },
        { status: 200 }
      );
    }

    // Update the transaction status
    const processedTxn = await db.onRampTransaction.update({
      where: { id: txnId },
      data: { status: status },
    });

    const txnUser = await db.onRampTransaction.findFirst({
      where: { id: txnId },
      include: {
        user: true, //include is used for including the related user object
      },
    });

    const userId = txnUser?.user?.id;

    if (status === "Success") {
      await db.user.update({
        where: { id: userId },
        data: {
          Balance: {
            increment: processedTxn.amount,
          },
        },
      });
      console.log(`User ${userId} topped up wallet with ₹${amount}`);
      return NextResponse.json(
        { message: "Wallet top-up successful!" },
        { status: 200 }
      );
    }

    console.log(`Transaction ${txnId} failed for user ${userId}`);
    return NextResponse.json({ message: "Payment failed!" }, { status: 400 });
  } catch (error: any) {
    console.error("Webhook error:", error.message);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
