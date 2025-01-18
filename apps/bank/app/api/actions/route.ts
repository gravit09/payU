import { NextResponse } from "next/server";
import crypto from "crypto";

const SECRET_KEY = "testKey";

interface PaymentPayload {
  txnId: string;
  amount: number;
  timestamp: number;
}

const verifySignedPayload = (
  payload: string,
  signature: string
): PaymentPayload | null => {
  const recreatedSignature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(payload)
    .digest("hex");
  if (recreatedSignature !== signature) {
    return null;
  }

  try {
    return JSON.parse(payload) as PaymentPayload;
  } catch {
    return null;
  }
};

export async function POST(req: Request) {
  const { payload, signature } = await req.json();

  if (!payload || !signature) {
    return NextResponse.json(
      { success: false, message: "Missing payload or signature" },
      { status: 400 }
    );
  }

  const verifiedPayload = verifySignedPayload(payload, signature);

  if (!verifiedPayload) {
    return NextResponse.json(
      { success: false, message: "Invalid or tampered signature" },
      { status: 400 }
    );
  }

  const isRecent = Date.now() - verifiedPayload.timestamp < 5 * 60 * 1000; // 5 minutes
  if (!isRecent) {
    return NextResponse.json(
      { success: false, message: "Payment request has expired" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, amount: verifiedPayload.amount });
}
