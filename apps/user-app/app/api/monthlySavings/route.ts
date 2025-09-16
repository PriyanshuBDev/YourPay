import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../lib/auth";
import { format } from "date-fns";
import {
  allTrnxProps,
  onRampTrnxProps,
  p2pTrnxProps,
} from "../creditDebit/route";
interface monSavingsProps {
  month: string;
  savings: number;
}
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const onRamps = await prisma.onRampTransaction.findMany({
      where: {
        UserId: session?.user.uid,
        status: "Success",
      },
      select: {
        amount: true,
        createdAt: true,
      },
    });

    const p2ps = await prisma.p2PTransaction.findMany({
      where: {
        OR: [
          { senderId: session?.user.uid },
          { receiverId: session?.user.uid },
        ],
        status: "Success",
      },
      select: {
        amount: true,
        createdAt: true,
        senderId: true,
        receiverId: true,
      },
    });

    const allTxns = [
      ...onRamps.map((t: onRampTrnxProps) => ({
        date: t.createdAt.toISOString() || "",
        credit: t.amount,
        debit: 0,
      })),
      ...p2ps.map((t: p2pTrnxProps) => ({
        date: t.createdAt.toISOString() || "",
        credit: t.receiverId === session?.user.uid ? t.amount : 0,
        debit: t.senderId === session?.user.uid ? t.amount : 0,
      })),
    ];

    const grouped: Record<string, { month: string; savings: number }> = {};

    allTxns.forEach((txn: allTrnxProps) => {
      const d = new Date(txn.date);
      const key = format(d, "yyyy-MM");
      if (!grouped[key]) {
        grouped[key] = {
          month: key,
          savings: 0,
        };
      }
      grouped[key]!.savings += txn.credit - txn.debit;
    });
    const data = Object.values(grouped)
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .map((d: monSavingsProps) => ({
        month: format(new Date(d.month + "-01"), "MMM"),
        savings: (d.savings / 100).toFixed(2),
      }));

    return NextResponse.json({
      data,
    });
  } catch (e) {
    console.error("Error:", e instanceof Error ? e.message : e);
    NextResponse.json({ data: {} }, { status: 500 });
  }
}
