"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";
interface props {
  id?: string;
  limit?: number;
  name?: string;
}
export async function budgetCreateUpdate({ id, limit, name }: props) {
  const session = await getServerSession(authOptions);
  if (!session?.user.uid) {
    return {
      msg: "You are not authenticated",
      status: 401,
    };
  }

  try {
    if (id) {
      await prisma.category.update({
        where: {
          userId: session.user.uid,
          id,
        },
        data: {
          limit,
        },
      });
    }
    if (limit && name) {
      await prisma.category.create({
        data: {
          name,
          limit,
          userId: session.user.uid,
        },
      });
    }
    return {
      msg: "Successfully updated/created Budget",
      status: 200,
    };
  } catch (e) {
    console.error(
      "Error encountered while creating/updating Budget:",
      e instanceof Error ? e.message : e
    );
    return {
      msg: "Error encountered while creating/updating Budget",
      status: 500,
    };
  }
}
