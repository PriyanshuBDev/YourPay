"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

interface OnRampTransactionProps {
  id: string;
  createdAt: Date;
  token: string;
  status: string;
  provider: string;
  amount: number;
  UserId: string;
}

export async function getOnRampTransaction() {
  const session = await getServerSession(authOptions);
  const transactions = await prisma.onRampTransaction.findMany({
    where: {
      id: session?.user.uid,
    },
  });

  return transactions.map((t: OnRampTransactionProps) => ({
    time: t.createdAt,
    amount: t.amount,
    status: t.status,
    provider: t.provider,
  }));
}
