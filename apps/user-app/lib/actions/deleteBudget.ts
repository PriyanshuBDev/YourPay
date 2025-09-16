"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function deleteBudget(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user.uid) {
    return {
      msg: "You are not authenticated",
      status: 401,
    };
  }
  try {
    await prisma.category.delete({
      where: {
        userId: session.user.uid,
        id,
      },
    });
    return {
      msg: "Successfully deleted the category",
      status: 200,
    };
  } catch (e) {
    console.error(
      "Error encountered while deleting category:",
      e instanceof Error ? e.message : e
    );
    return {
      msg: "Error encountered while deleting category",
      status: 500,
    };
  }
}
