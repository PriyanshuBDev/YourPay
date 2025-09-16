import { adminAuth } from "../../../lib/firebaseAdmin";
import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();
  const decoded = await adminAuth.verifyIdToken(idToken);
  const uid = decoded.uid;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: uid,
      },
    });
    return NextResponse.json({ exists: !!user });
  } catch (e) {
    console.error("Error:", e instanceof Error ? e.message : e);
    return NextResponse.json({}, { status: 500 });
  }
}
