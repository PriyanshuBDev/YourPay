import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";

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
  const input = searchParams.get("input");
  if (!input || input.trim().length === 0) {
    return NextResponse.json(
      {
        msg: "No search filter",
        transactions: [],
        totalPage: 0,
        total: 0,
      },
      {
        status: 500,
      }
    );
  }
  const rawPage = Number(searchParams.get("page") || 1);
  const page = !isNaN(rawPage) && rawPage > 0 ? rawPage : 1;
  const take = 10;
  const skip = (page - 1) * take;
  const searchTerm = `%${input}%`;
  try {
    const searchTrnxs = await prisma.$queryRaw<
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
        AND (
          id = ${input} OR 
          provider ILIKE ${searchTerm}
        )
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
        AND (
          p.id = ${input} OR
          s."publicId" = ${input} OR
          r."publicId" = ${input} OR
          s.username ILIKE ${searchTerm} OR
          r.username ILIKE ${searchTerm} OR
          s.email = ${input} OR
          r.email = ${input}
        )
    )
    ORDER BY "createdAt" DESC
    LIMIT ${take}
    OFFSET ${skip}
    `;
    const trnxs = searchTrnxs.map((txn) => ({
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
          OR: [
            { senderId: session?.user.uid },
            { receiverId: session?.user.uid },
          ],

          ...(input && {
            OR: [
              { id: input },
              { receiver: { publicId: input } },
              {
                receiver: {
                  username: { contains: input, mode: "insensitive" },
                },
              },
              { receiver: { email: input } },
              { sender: { publicId: input } },
              {
                sender: { username: { contains: input, mode: "insensitive" } },
              },
              { sender: { email: input } },
            ],
          }),
        },
      }),
      prisma.onRampTransaction.count({
        where: {
          UserId: session?.user.uid,
          OR: [
            {
              provider: {
                contains: input!,
                mode: "insensitive",
              },
            },
            { id: input! },
          ],
        },
      }),
    ]);

    return NextResponse.json(
      {
        transactions: trnxs,
        msg: `Successfully fetched all transactions by input:${input}`,
        total: p2psCount + topUpsCount,
        totalPage: Math.ceil((p2psCount + topUpsCount) / 10),
      },
      { status: 200 }
    );
  } catch (e) {
    console.error(
      "Error encountered while fetching transactions by input",
      e instanceof Error ? e.message : e
    );
    return NextResponse.json(
      { msg: "Error encountered", transactions: [], totalPage: 0, total: 0 },
      { status: 500 }
    );
  }
}
