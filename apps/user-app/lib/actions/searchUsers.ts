"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function searchUsers(input: string) {
  const session = await getServerSession(authOptions);
  try {
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          id: session?.user.uid,
        },
        OR: [
          { publicId: input },
          { username: { contains: input, mode: "insensitive" } },
          { email: input },
        ],
      },
      select: {
        id: true,
        publicId: true,
        profileImg: true,
        username: true,
        email: true,
      },
    });
    const userIds = users.map((u) => u.id);
    const isQUser = await prisma.quickUser.findMany({
      where: {
        userId: session?.user.uid,
        qUserId: { in: userIds },
      },
      select: {
        qUserId: true,
      },
    });
    const qUserSet = new Set(isQUser.map((q) => q.qUserId));
    const completeUsers = users.map((u) => ({
      ...u,
      isAQUser: qUserSet.has(u.id),
    }));
    return {
      users: completeUsers,
      msg: `Successfully found all users with input:${input}`,
      status: 200,
    };
  } catch (e) {
    console.error("Error encountered:", e instanceof Error ? e.message : e);
    return { users: [], msg: "Error encountered", status: 500 };
  }
}
