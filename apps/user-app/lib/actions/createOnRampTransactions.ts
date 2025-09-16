"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";
import { randomUUID } from "crypto";
import { checkPassword } from "./checkPassword";

export async function createOnRampTransactions(
  provider: string,
  amount: number,
  password: string
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user.uid) {
    return { msg: "Unauthenticated request" };
  }
  try {
    const res = await checkPassword(password);
    if (res.status !== 200) {
      return {
        msg: res.msg,
        status: res.status,
      };
    }
    const token = randomUUID(); // in real world it should be token fetched from a bank api
    await prisma.$transaction(async (prisma) => {
      const onRamp = await prisma.onRampTransaction.create({
        data: {
          UserId: session.user.uid,
          provider,
          status: "Processing",
          amount: amount * 100,
          token,
        },
      });
      await prisma.balance.update({
        where: {
          userId: session.user.uid,
        },
        data: {
          locked: {
            increment: amount * 100,
          },
        },
      });
      await prisma.notification.create({
        data: {
          receiverId: session.user.uid,
          message: `Your ₹${amount / 100} top-up from ${provider} is in process. Track status.`,
          type: "Transaction",
          onRampTransactionId: onRamp.id,
          status: "Processing",
        },
      });
    });

    return {
      msg: "Walltet topUp added",
      status: 200,
      token,
    };
  } catch (e) {
    console.error("Error encountered:", e instanceof Error ? e.message : e);
    return {
      msg: "Error encountered",
      status: 500,
      token: null,
    };
  }
}
