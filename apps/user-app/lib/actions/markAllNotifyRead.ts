"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function markAllNotificationsRead() {
  const session = await getServerSession(authOptions);
  if (!session?.user.uid) {
    return {
      msg: "You are not authenticated",
      status: 401,
    };
  }
  try {
    await prisma.notification.updateMany({
      where: {
        receiverId: session.user.uid,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
    return {
      msg: "Successfully marked all notifications read",
      status: 200,
    };
  } catch (e) {
    console.error(
      "Error encountered while marking all notifications read:",
      e instanceof Error ? e.message : e
    );
    return {
      msg: "Error encountered while marking all notifications read",

      status: 500,
    };
  }
}
