import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";
import { allRecentTrnxProps } from "../byDate/route";
import { OnRampProps, P2PProps } from "../full/[type]/[page]/route";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "all";
  const session = await getServerSession(authOptions);
  if (!session?.user.uid) {
    return NextResponse.json(
      { msg: "You are not authenticated", transactions: [] },
      { status: 401 }
    );
  }
  const id = session?.user.uid;
  try {
    if (type === "all") {
      const lastTxns = await prisma.$queryRaw<
        {
          id: string;
          createdAt: Date;
          credit: number;
          debit: number;
          recipient: string;
          profileImg: string;
          status: string;
          category: string | "None";
          type: string;
        }[]
      >`
    (
      SELECT id, "createdAt", amount as credit, 0 as debit, provider as recipient, 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' as "profileImg", status, 'None' as category, 'onRamp' as type
      FROM "OnRampTransaction"
      WHERE "UserId" = ${id}
    )
    UNION ALL
    (
      SELECT p.id, p."createdAt",
        CASE WHEN p."receiverId" = ${id} THEN p.amount ELSE 0 END as credit,
        CASE WHEN p."senderId" = ${id} THEN p.amount ELSE 0 END as debit,
        CASE WHEN p."receiverId" = ${id} THEN s.username ELSE r.username END as recipient,
        CASE WHEN p."receiverId" = ${id} THEN s."profileImg" ELSE r."profileImg" END as "profileImg", p.status, COALESCE(c.name, 'None') as category, 'p2p' as type
      FROM "P2PTransaction" p
      JOIN "User" s on p."senderId" = s.id
      JOIN "User" r on p."receiverId" = r.id
      LEFT JOIN  "Category" c on p."categoryId" = c.id
      WHERE p."senderId" = ${id} OR p."receiverId" = ${id}
    )
    ORDER BY "createdAt" DESC
    LIMIT 5
    `;
      const recentTrnxs = lastTxns.map((txn: allRecentTrnxProps) => ({
        id: txn.id,
        date: txn.createdAt.toISOString(),
        status: txn.status,
        recipient: txn.recipient,
        profileImg: txn.profileImg,
        credit: txn.credit,
        debit: txn.debit,
        category: txn.category || "None",
      }));
      return NextResponse.json({
        transactions: recentTrnxs,
        msg: "Successfully fetched last 5 transactions",
      });
    } else if (type === "p2p") {
      const p2p = await prisma.p2PTransaction.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          OR: [{ senderId: id }, { receiverId: id }],
        },
        select: {
          id: true,
          createdAt: true,
          sender: {
            select: {
              username: true,
              profileImg: true,
            },
          },
          receiver: {
            select: {
              username: true,
              profileImg: true,
            },
          },
          receiverId: true,
          senderId: true,
          amount: true,
          status: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      });

      const recentP2PTrnxs = p2p.map((p: P2PProps) => ({
        id: p.id,
        status: p.status,
        date: p.createdAt.toISOString(),
        recipient: p.senderId === id ? p.receiver.username : p.sender.username,
        profileImg:
          p.senderId === id ? p.receiver.profileImg : p.sender.profileImg,
        credit: p.receiverId === id ? p.amount : 0,
        debit: p.senderId === id ? p.amount : 0,
        category: p.category?.name || "None",
      }));
      return NextResponse.json({
        transactions: recentP2PTrnxs,
        msg: "Successfully fetched last 5 p2p transactions",
      });
    } else {
      const topUps = await prisma.onRampTransaction.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          UserId: id,
        },
      });
      const recentTopUps = topUps.map((t: OnRampProps) => ({
        id: t.id,
        status: t.status,
        credit: t.amount,
        debit: 0,
        date: t.createdAt.toISOString(),
        category: "None",
        recipient: t.provider,
        profileImg:
          "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
      }));
      return NextResponse.json({
        transactions: recentTopUps,
        msg: "Successfully fetched last 5 topUps transactions",
      });
    }
  } catch (e) {
    console.error(
      "Error encountered while fetching recent transactions:",
      e instanceof Error ? e.message : e
    );
    return NextResponse.json(
      {
        msg: "Error encountered while fetching recent transactions",
        transactions: [],
      },
      { status: 500 }
    );
  }
}
