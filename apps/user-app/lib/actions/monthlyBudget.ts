"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { endOfMonth, startOfMonth } from "date-fns";
import { authOptions } from "../auth";

export async function getMontlyBudget() {
  const session = await getServerSession(authOptions);
  const id = session?.user.uid;
  if (!id) {
    return { msg: "You are not authenticated", budget: [], status: 401 };
  }
  try {
    const categories = await prisma.category.findMany({
      where: {
        userId: id,
      },
      include: {
        p2p: {
          where: {
            status: "Success",
            createdAt: {
              gte: startOfMonth(new Date()),
              lte: endOfMonth(new Date()),
            },
          },
          select: {
            amount: true,
          },
        },
      },
    });

    const budget = categories.map((c) => ({
      id: c.id,
      limit: c.limit,
      name: c.name,
      spent: c.p2p.reduce((sum, t) => sum + t.amount, 0),
    }));

    return {
      msg: "Successfully fetched the budget",
      budget,
      status: 200,
    };
  } catch (e) {
    console.error(
      "Error encountered while fetching monthly budget",
      e instanceof Error ? e.message : e
    );
    return {
      msg: "Error encountered while fetching monthly budget",
      budget: [],
      status: 500,
    };
  }
}
