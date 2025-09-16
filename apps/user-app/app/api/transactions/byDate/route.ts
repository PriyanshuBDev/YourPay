import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";
import prisma from "@repo/db/client";
import { Prisma } from "@prisma/client";

export interface allRecentTrnxProps {
  id: string;
  createdAt: Date;
  credit: number;
  debit: number;
  recipient: string;
  profileImg: string;
  status: string;
  category: string;
  type: string;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const id = session?.user.uid;
  if (!id) {
    return NextResponse.json(
      {
        msg: "You are not authenticated",
        transactions: [],
        totalPage: 0,
        total: 0,
      },
      { status: 401 }
    );
  }
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const rawPage = Number(searchParams.get("page") || 1);
  const page = !isNaN(rawPage) && rawPage > 0 ? rawPage : 1;
  const take = 10;
  const skip = (page - 1) * take;
  const dateFilter =
    from || to
      ? {
          createdAt: {
            ...(from ? { gte: new Date(from) } : {}),
            ...(to ? { lte: new Date(to) } : {}),
          },
        }
      : {};

  const onRampDateSql =
    from || to
      ? Prisma.sql`
      AND "createdAt" BETWEEN
        ${from ? new Date(from) : new Date("1970-01-01")}
        AND ${to ? new Date(to) : Prisma.sql`NOW()`}
    `
      : Prisma.empty;

  const p2pDateSql =
    from || to
      ? Prisma.sql`
      AND p."createdAt" BETWEEN
        ${from ? new Date(from) : new Date("1970-01-01")}
        AND ${to ? new Date(to) : Prisma.sql`NOW()`}
    `
      : Prisma.empty;

  try {
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
      ${onRampDateSql}
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
      WHERE (p."senderId" = ${id} OR p."receiverId" = ${id})
      ${p2pDateSql}
    )
    ORDER BY "createdAt" DESC
    LIMIT ${take}
    OFFSET ${skip}
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
    const [p2psCount, topUpsCount] = await Promise.all([
      prisma.p2PTransaction.count({
        where: {
          OR: [{ senderId: id }, { receiverId: id }],
          ...dateFilter,
        },
      }),
      prisma.onRampTransaction.count({
        where: {
          UserId: id,
          ...dateFilter,
        },
      }),
    ]);
    return NextResponse.json({
      transactions: recentTrnxs,
      msg: `Successfully fetched all transactions from ${from || "1970-01-01"} to ${to || "Now"}`,
      totalPage: Math.ceil((p2psCount + topUpsCount) / take),
      total: p2psCount + topUpsCount,
    });
  } catch (e) {
    console.error(
      "Error encountered while fetching transactions by date",
      e instanceof Error ? e.message : e
    );
    return NextResponse.json(
      { msg: "Error encountered", transactions: [], totalPage: 0, total: 0 },
      { status: 500 }
    );
  }
}
