"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma, { PrismaClient } from "@repo/db/client";
import { checkPassword } from "./checkPassword";

export async function p2pTransfer(
  otherUserId: string,
  amount: number,
  password: string,
  categoryId?: string
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.uid) {
    return {
      msg: "Unauthorized request",
      status: 401,
    };
  }
  const res = await checkPassword(password);
  if (res.status !== 200) {
    return {
      msg: res.msg,
      status: res.status,
    };
  }
  amount *= 100;
  const userExist = await prisma.user.findUnique({
    where: {
      id: otherUserId,
    },
    select: {
      id: true,
      username: true,
    },
  });
  if (!userExist || !userExist.id) {
    console.error("User not found");
    return {
      msg: "User not found",
      status: 404,
    };
  }
  if (otherUserId === session.user.uid) {
    console.error("Self transaction is not allowed");
    return {
      msg: "Self transaction is not allowed",
      status: 404,
    };
  }
  const transaction = await prisma.$transaction(
    async (
      prisma: Omit<
        PrismaClient,
        | "$connect"
        | "$disconnect"
        | "$on"
        | "$transaction"
        | "$use"
        | "$extends"
      >
    ) => {
      const senderBalance = await prisma.balance.findUnique({
        where: {
          userId: session.user.uid,
        },
      });
      if (!senderBalance || senderBalance.amount < amount) {
        throw new Error("Insufficient Balance");
      }

      await prisma.balance.update({
        where: {
          userId: session.user.uid,
        },
        data: {
          amount: {
            decrement: amount,
          },
          locked: {
            increment: amount,
          },
        },
      });
      return await prisma.p2PTransaction.create({
        data: {
          senderId: session.user.uid,
          receiverId: userExist.id,
          amount,
          status: "Processing",
          categoryId,
        },
        select: {
          id: true,
          status: true,
          amount: true,
          createdAt: true,
          receiver: {
            select: {
              username: true,
              profileImg: true,
              publicId: true,
              email: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
        },
      });
    }
  );

  if (!transaction.id || !transaction) {
    return {
      msg: "Error encountered during transaction",
      status: 500,
      transaction,
    };
  }
  await prisma.notification.create({
    data: {
      receiverId: session.user.uid,
      message: `₹${amount / 100} transfer to ${userExist.username || "user"} is processing. Track status.`,
      type: "Transaction",
      p2pTransactionId: transaction.id,
      status: "Processing",
    },
  });
  try {
    await prisma.$transaction(
      async (
        tx: Omit<
          PrismaClient,
          | "$connect"
          | "$disconnect"
          | "$on"
          | "$transaction"
          | "$use"
          | "$extends"
        >
      ) => {
        const decrement = await tx.balance.updateMany({
          where: {
            userId: session.user.uid,
          },
          data: {
            locked: {
              decrement: amount,
            },
          },
        });
        if (decrement.count === 0) {
          throw new Error("Error encountered");
        }

        await tx.balance.update({
          where: {
            userId: userExist.id,
          },
          data: {
            amount: {
              increment: amount,
            },
          },
        });
        await tx.p2PTransaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            status: "Success",
          },
        });
        await tx.notification.create({
          data: {
            senderId: session.user.uid,
            receiverId: userExist.id,
            message: `₹${amount / 100} has been received from ${session.user.name}. Tap to view details.`,
            type: "Transaction",
            p2pTransactionId: transaction.id,
            status: "Success",
          },
        });
        await tx.notification.create({
          data: {
            receiverId: session.user.uid,
            message: `₹${amount / 100} sent to ${userExist.username || "user"} successfully. Tap to view details.`,
            type: "Transaction",
            p2pTransactionId: transaction.id,
            status: "Success",
          },
        });
      }
    );
    const success = { ...transaction, status: "Success" };
    return {
      msg: "Payment was successful",
      status: 200,
      transaction: success,
    };
  } catch (e) {
    await prisma.$transaction(
      async (
        prisma: Omit<
          PrismaClient,
          | "$connect"
          | "$disconnect"
          | "$on"
          | "$transaction"
          | "$use"
          | "$extends"
        >
      ) => {
        await prisma.p2PTransaction.updateMany({
          where: {
            id: transaction.id,
            status: "Processing",
          },
          data: {
            status: "Failure",
          },
        });
        await prisma.balance.update({
          where: {
            userId: session.user.uid,
          },
          data: {
            locked: {
              decrement: amount,
            },
            amount: {
              increment: amount,
            },
          },
        });
        await prisma.notification.create({
          data: {
            receiverId: session.user.uid,
            message: `Transfer of ₹${amount / 100} to ${userExist.username || "user"} failed. Amount refunded.`,
            type: "Transaction",
            p2pTransactionId: transaction.id,
            status: "Failure",
          },
        });
      }
    );
    console.error("Error:", e instanceof Error ? e.message : e);
    return {
      msg: "Transaction failed, your payment has been refunded",
      status: 500,
      transaction: { ...transaction, status: "Failure" },
    };
  }
}
