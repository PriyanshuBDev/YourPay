"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function getQuickUsers() {
  const session = await getServerSession(authOptions);
  try {
    const qUsers = await prisma.quickUser.findMany({
      where: {
        userId: session?.user.uid,
      },
      select: {
        qUser: {
          select: {
            id: true,
            username: true,
            profileImg: true,
            email: true,
            publicId: true,
          },
        },
      },
    });
    return qUsers;
  } catch (e) {
    console.error("Error encountered:", e instanceof Error ? e.message : e);
    alert("Error encountered");
    return [];
  }
}
