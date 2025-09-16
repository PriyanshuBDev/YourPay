"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function getUserDetails() {
  const session = await getServerSession(authOptions);
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session?.user.uid,
      },
      select: {
        profileImg: true,
        publicId: true,
        categories: true,
      },
    });
    return {
      img: user?.profileImg,
      publicId: user?.publicId,
      categories: user?.categories,
    };
  } catch (e) {
    console.error("Error encountered:", e instanceof Error ? e.message : e);
    alert("Error encountered");
    return { img: null, publicId: null };
  }
}
