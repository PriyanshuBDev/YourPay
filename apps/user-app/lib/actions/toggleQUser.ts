"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function toggleQUser(qUserId: string) {
  const session = await getServerSession(authOptions);
  const id = session?.user.uid;
  if (!id) {
    console.error("Error: Your are not authenticated");
    return;
  }

  try {
    const qUserExist = await prisma.quickUser.findUnique({
      where: {
        userId_qUserId: { userId: id, qUserId },
      },
    });
    if (qUserExist) {
      return await prisma.quickUser.delete({
        where: {
          userId_qUserId: { userId: id, qUserId },
        },
      });
    }
    return await prisma.quickUser.create({
      data: {
        userId: id,
        qUserId,
      },
    });
  } catch (e) {
    console.error("Error encountered:", e instanceof Error ? e.message : e);
    return;
  }
}
