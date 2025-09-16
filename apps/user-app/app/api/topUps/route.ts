import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "@repo/db/client";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { onRampTrnxProps } from "../creditDebit/route";

interface allOnRampTrnxProps {
  date: string;
  credit: number;
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
  } else if (timePeriod === "Month") {
    start = startOfMonth(new Date());
    end = endOfMonth(new Date());
  } else if (timePeriod === "Year") {
    start = startOfYear(new Date());
    end = endOfYear(new Date());
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.uid) {
      return NextResponse.json({ transactions: [] }, { status: 401 });
    }

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

    const allTxns = [
      ...onRamps.map((t: onRampTrnxProps) => ({
        date: t.createdAt.toISOString() || "",
        credit: t.amount,
      })),
    ];

    const grouped: Record<string, { date: string; credit: number }> = {};

    allTxns.forEach((txn: allOnRampTrnxProps) => {
      let key = "";

      if (timePeriod === "Today") {
        key = format(new Date(txn.date), "HH:mm");
      } else if (timePeriod === "Week") {
        key = format(new Date(txn.date), "MM-dd");
      } else if (timePeriod === "Month") {
        key = format(new Date(txn.date), "dd");
      } else if (timePeriod === "Year") {
        key = format(new Date(txn.date), "yyyy-MM");
      }
      if (!grouped[key]) {
        grouped[key] = {
          date: new Date(txn.date).toISOString(),
          credit: 0,
        };
      }
      grouped[key]!.credit += txn.credit;
    });

    return NextResponse.json({
      transactions: Object.values(grouped).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    });
  } catch (e) {
    console.error("Error:", e instanceof Error ? e.message : e);
    return NextResponse.json({ transaction: [] }, { status: 500 });
  }
}
