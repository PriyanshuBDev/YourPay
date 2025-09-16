"use server";

import { adminAuth } from "../firebaseAdmin";

export async function checkEmailExists(email: string) {
  try {
    await adminAuth.getUserByEmail(email);
    return true;
  } catch (e: any) {
    if (e.code === "auth/user-not-found") return false;

    throw e;
  }
}
