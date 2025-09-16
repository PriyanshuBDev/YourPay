"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function getPaySearchUsers(input: string, take: number) {
  const session = await getServerSession(authOptions);
  try {
    const users = await prisma.user.findMany({
      take,
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
    return {
      users,
      msg: `Successfully found all users with input:${input}`,
      status: 200,
    };
  } catch (e) {
    console.error("Error encountered:", e instanceof Error ? e.message : e);
    return { users: [], msg: "Error encountered", status: 500 };
  }
}
