"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "@repo/db/client";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export interface onRampTrnxProps {
  createdAt: Date;
  amount: number;
}

export interface p2pTrnxProps {
  createdAt: Date;
  amount: number;
  senderId: string;
  receiverId: string;
}

export interface allTrnxProps {
  date: string;
  credit: number;
  debit: number;
}

export async function GET(req: NextRequest) {
  let start;
  let end;
  const { searchParams } = new URL(req.url);
  const timePeriod = searchParams.get("timePeriod") || "Today";

  if (timePeriod === "Today") {
    start = startOfDay(new Date());
    end = endOfDay(new Date());
  } else if (timePeriod === "Week") {
    start = startOfWeek(new Date(), { weekStartsOn: 1 });
    end = endOfWeek(new Date(), { weekStartsOn: 1 });
  } else {
    start = startOfMonth(new Date());
    end = endOfMonth(new Date());
  }

  try {
    const session = await getServerSession(authOptions);

    const onRamps = await prisma.onRampTransaction.findMany({
      where: {
        UserId: session?.user.uid,
        status: "Success",
        createdAt: {
          gte: start,
          lte: end,
        },
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
        createdAt: {
          gte: start,
          lte: end,
        },
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

    const grouped: Record<
      string,
      { date: string; credit: number; debit: number }
    > = {};

    allTxns.forEach((txn: allTrnxProps) => {
      let key = "";

      if (timePeriod === "Today") {
        key = format(new Date(txn.date), "HH:mm");
      } else if (timePeriod === "Week") {
        key = format(new Date(txn.date), "yyyy-MM-dd");
      } else {
        key = format(new Date(txn.date), "yyyy-MM-dd");
      }
      if (!grouped[key]) {
        grouped[key] = {
          date: new Date(txn.date).toISOString(),
          credit: 0,
          debit: 0,
        };
      }
      grouped[key]!.credit += txn.credit;
      grouped[key]!.debit += txn.debit;
    });

    return NextResponse.json({
      transactions: Object.values(grouped).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    });
  } catch (e) {
    console.error("Error:", e instanceof Error ? e.message : e);
    NextResponse.json({ transaction: [] }, { status: 500 });
  }
}
