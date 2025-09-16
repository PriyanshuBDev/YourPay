import { adminAuth } from "../../../lib/firebaseAdmin";
import prisma from "@repo/db/client";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { idToken, username, password } = body;
  const decoded = await adminAuth.verifyIdToken(idToken);
  const id = decoded.uid;
  const email = decoded.email;
  const publicId = nanoid(16).toUpperCase();

  try {
    if (!id || !email) {
      throw new Error("Invalid credentials");
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        id,
        email,
        username,
        password: hashed,
        publicId,
      },
    });
    await prisma.balance.create({
      data: {
        userId: user.id,
      },
    });
    return NextResponse.json({ user });
  } catch (e) {
    console.log("Error:", e instanceof Error ? e.message : e);
    return NextResponse.json(
      {
        msg: "Error encountered",
      },
      { status: 500 }
    );
  }
}
