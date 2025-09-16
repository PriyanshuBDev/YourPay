import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username }: { username: string } = await req.json();

  try {
    const exist = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (exist) {
      return NextResponse.json(
        { msg: "Username already taken", available: false },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { msg: "Username doesn't exist", available: true },
        { status: 200 }
      );
    }
  } catch (e) {
    console.error("Error encountered:", e instanceof Error ? e.message : e);
    return NextResponse.json(
      { msg: "Error encountered while checking username", available: false },
      { status: 500 }
    );
  }
}
