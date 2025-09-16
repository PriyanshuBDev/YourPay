"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function markNotificationRead(notificationId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user.uid) {
    return {
      msg: "You are not authenticated",
      status: 401,
    };
  }
  try {
    await prisma.notification.update({
      where: {
        receiverId: session.user.uid,
        isRead: false,
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });
    return {
      msg: "Successfully marked notification read",
      status: 200,
    };
  } catch (e) {
    console.error(
      "Error encountered while marking notification read:",
      e instanceof Error ? e.message : e
    );
    return {
      msg: "Error encountered while marking notification read",

      status: 500,
    };
  }
}
