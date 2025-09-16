import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PaymentSchema } from "@repo/zod";
import { env } from "hono/adapter";
import { getPrisma } from "@repo/db/client";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});
app.get("/ping", async (c) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
  try {
    const prisma = new PrismaClient({
      datasourceUrl: DATABASE_URL,
    }).$extends(withAccelerate());

    const count = await prisma.onRampTransaction.count();
    return c.json({ count });
  } catch (e) {
    return c.json({ error: e instanceof Error ? e.message : e }, 500);
  }
});
app.post("/bankWebhook", async (c) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
  const prisma = getPrisma(DATABASE_URL);
  const { token, user_identifier, amount, status } = await c.req.json();

  const paymentInformation: {
    token: string;
    userId: string;
    amount: number;
    status: string;
  } = {
    token,
    userId: user_identifier,
    amount,
    status,
  };
  try {
    const result = PaymentSchema.safeParse(paymentInformation);
    if (!result.success) {
      throw new Error("Invalid Payment Information");
    }
    const transaction = await prisma.onRampTransaction.updateMany({
      where: {
        token: result.data.token,
        status: "Processing",
      },
      data: {
        status: result.data.status === "SUCCESS" ? "Success" : "Failure",
      },
    });
    if (!transaction || transaction.count === 0) {
      // transaction.count will be 0 when the update wasn't made if it was then it would be 1 means its has been processed i.e. successed it is done here to avoid race condition
      throw new Error("Transaction already processed or not found");
    }
    const trnxDetails = await prisma.onRampTransaction.findFirst({
      where: {
        UserId: result.data.userId,
        token: result.data.token,
      },
      select: {
        id: true,
        provider: true,
      },
    });
    if (!trnxDetails) {
      throw new Error("Transaction details not found");
    }

    if (result.data.status === "SUCCESS") {
      await prisma.$transaction([
        prisma.balance.update({
          where: {
            userId: result.data.userId,
          },
          data: {
            amount: {
              increment: result.data.amount,
            },
            locked: {
              decrement: result.data.amount,
            },
          },
        }),
        prisma.notification.create({
          data: {
            message: `₹${result.data.amount / 100} topUp from ${trnxDetails.provider} was successful. Tap to view details.`,
            type: "Transaction",
            receiverId: result.data.userId,
            onRampTransactionId: trnxDetails.id,
            status: "Success",
          },
        }),
      ]);
    } else {
      await prisma.$transaction([
        prisma.balance.update({
          where: {
            userId: result.data.userId,
          },
          data: {
            locked: {
              decrement: result.data.amount,
            },
          },
        }),
        prisma.notification.create({
          data: {
            message: `₹${result.data.amount / 100} topUp from ${trnxDetails.provider} Failed. Tap to view details.`,
            type: "Transaction",
            receiverId: result.data.userId,
            onRampTransactionId: trnxDetails.id,
            status: "Failure",
          },
        }),
      ]);
    }

    return c.json({ msg: "Captured" }, 200);
  } catch (e) {
    console.error("Error encountered:", e instanceof Error ? e.message : e);
    return c.json(
      {
        msg: "Error encountered while handling payment",
      },
      500
    );
  }
});

export default app;
