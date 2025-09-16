"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function handleUserNameEdit(username: string) {
  const session = await getServerSession(authOptions);
  const id = session?.user.uid;
  if (!id) {
    console.error("You are not authenticated");
    alert("Your are not authenticated");
  }

  try {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        username,
      },
    });
  } catch (e) {
    console.error("Error encountered:", e instanceof Error ? e.message : e);
    alert("Error encountered");
  }
}
