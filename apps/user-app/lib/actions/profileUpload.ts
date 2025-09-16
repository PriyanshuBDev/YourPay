"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function handleProfileUpload(imgUrl: string) {
  const session = await getServerSession(authOptions);
  return prisma.user.update({
    where: { id: session?.user.uid },
    data: { profileImg: imgUrl },
  });
}
