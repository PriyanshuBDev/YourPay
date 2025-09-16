"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function getNotifications() {
  const session = await getServerSession(authOptions);
  if (!session?.user.uid) {
    return {
      msg: "You are not authenticated",
      notifications: [],
      status: 401,
    };
  }
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        receiverId: session.user.uid,
        isRead: false,
      },
    });
    return {
      msg: "Successfully fetched all notifications",
      notifications,
      status: 200,
    };
  } catch (e) {
    console.error(
      "Error encountered while fetching notifications:",
      e instanceof Error ? e.message : e
    );
    return {
      msg: "Error encountered while fetching notifications",
      notifications: [],
      status: 500,
    };
  }
}
