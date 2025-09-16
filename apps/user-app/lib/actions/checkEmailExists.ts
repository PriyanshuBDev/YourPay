"use server";

import { adminAuth } from "../firebaseAdmin";

export async function checkEmailExists(email: string) {
  try {
    await adminAuth.getUserByEmail(email);
    return true;
  } catch (e: unknown) {
    if (typeof e === "object" && e !== null && "code" in e) {
      const err = e as { code: string };
      if (err.code === "auth/user-not-found") {
        return false;
      }
    }
    throw e;
  }
}
