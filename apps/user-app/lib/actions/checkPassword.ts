import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";
import bcrypt from "bcrypt";

export async function checkPassword(password: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.uid) {
    return {
      msg: "Unauthorized request",
      status: 401,
    };
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.uid,
      },
      select: {
        password: true,
      },
    });
    if (!user) {
      return {
        msg: "User not found",
        status: 404,
      };
    }
    const verified = await bcrypt.compare(password, user.password);
    if (!verified) {
      return {
        msg: "Invalid Password",
        status: 401,
      };
    }
    return {
      msg: "verified",
      status: 200,
    };
  } catch (e) {
    console.error(
      "Error encountered while verifying password:",
      e instanceof Error ? e.message : e
    );
    return {
      msg: "Error encountered",
      status: 500,
    };
  }
}
