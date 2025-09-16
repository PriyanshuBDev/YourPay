import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../../../lib/auth";
import prisma from "@repo/db/client";

export async function GET(
  req: Request,
  context: { params: Promise<{ type: string; page: string }> }
) {
  const { type, page } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user.uid) {
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

  const id = session.user.uid;
  const rawPage = Number(page || 1);
  const currentPage = !isNaN(rawPage) && rawPage > 0 ? rawPage : 1;
  const take = 10;
  const skip = (currentPage - 1) * take;
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
      SELECT id, "createdAt", amount as credit, 0 as debit, provider as recipient, 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' as "profileImg", CAST(status AS TEXT) as status, 'None' as category, 'onRamp' as type
      FROM "OnRampTransaction"
      WHERE "UserId" = ${id}
    )
    UNION ALL
    (
      SELECT p.id, p."createdAt",
        CASE WHEN p."receiverId" = ${id} THEN p.amount ELSE 0 END as credit,
        CASE WHEN p."senderId" = ${id} THEN p.amount ELSE 0 END as debit,
        CASE WHEN p."receiverId" = ${id} THEN s.username ELSE r.username END as recipient,
        CASE WHEN p."receiverId" = ${id} THEN s."profileImg" ELSE r."profileImg" END as "profileImg",
        CAST(p.status AS TEXT) as status, COALESCE(c.name, 'None') as category, 'p2p' as type
      FROM "P2PTransaction" p
      JOIN "User" s on p."senderId" = s.id
      JOIN "User" r on p."receiverId" = r.id
      LEFT JOIN  "Category" c on p."categoryId" = c.id
      WHERE p."senderId" = ${id} OR p."receiverId" = ${id}
    )
    ORDER BY "createdAt" DESC
    LIMIT ${take}
    OFFSET ${skip}
    `;
      const recentTrnxs = lastTxns.map((txn) => ({
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
          where: { OR: [{ senderId: id }, { receiverId: id }] },
        }),
        prisma.onRampTransaction.count({ where: { UserId: id } }),
      ]);
      return NextResponse.json({
        transactions: recentTrnxs,
        msg: "Successfully fetched all transactions",
        totalPage: Math.ceil((p2psCount + topUpsCount) / take),
        total: p2psCount + topUpsCount,
      });
    } else if (type === "p2p") {
      const p2p = await prisma.p2PTransaction.findMany({
        take,
        skip,
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
      const p2psCount = await prisma.p2PTransaction.count({
        where: {
          OR: [{ senderId: id }, { receiverId: id }],
        },
      });

      const p2PTrnxs = p2p.map((p) => ({
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
        transactions: p2PTrnxs,
        msg: "Successfully fetched all p2p transactions",
        totalPage: Math.ceil(p2psCount / take),
        total: p2psCount,
      });
    } else {
      const topUps = await prisma.onRampTransaction.findMany({
        take,
        skip,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          UserId: id,
        },
      });
      const topUpTrnxs = topUps.map((t) => ({
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
      const topUpsCount = await prisma.onRampTransaction.count({
        where: {
          UserId: id,
        },
      });

      return NextResponse.json({
        transactions: topUpTrnxs,
        msg: "Successfully fetched all topUps transactions",
        totalPage: Math.ceil(topUpsCount / take),
        total: topUpsCount,
      });
    }
  } catch (e) {
    console.error(
      "Error encountered while fetching transactions:",
      e instanceof Error ? e.message : e
    );
    return NextResponse.json(
      {
        msg: "Error encountered while fetching transactions",
        transactions: [],
        totalPage: 0,
        total: 0,
      },
      { status: 500 }
    );
  }
}
