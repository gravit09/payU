import express from "express";
import db from "@repo/db/client";
import { decode } from "next-auth/jwt";
const app = express();

app.use(express.json());
app.post("/bobWebhook", async (req, res) => {
  const paymentInformation: {
    token: string;
    userId: string;
  } = {
    token: req.body.token,
    userId: req.body.user_identifier,
  };

  const secret = process.env.NEXTAUTH_SECRET || "fallback_secret";
  const decodedToken = await decode({
    token: paymentInformation.token,
    secret,
  });

  try {
    await db.$transaction([
      db.balance.updateMany({
        where: {
          userId: paymentInformation.userId,
        },
        data: {
          amount: {
            //using increment beacause of the concurrent requests
            increment: Number(),
          },
        },
      }),
      db.onRampTransaction.updateMany({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: "Success",
        },
      }),
    ]);

    res.json({
      message: "Captured",
    });
  } catch (e) {
    console.error(e);
    res.status(411).json({
      message: "Error while processing webhook",
    });
  }
});

app.listen(3003);
