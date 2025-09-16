import * as admin from "firebase-admin";
import { Auth } from "firebase-admin/auth";

const serviceAccountKeyBase64 = process.env.NEXT_PUBLIC_FIREBASE_ACCOUNT_KEY;
const serviceAccountKeyJson = Buffer.from(
  serviceAccountKeyBase64!,
  "base64"
).toString("utf-8");
const serviceAccountKey = JSON.parse(serviceAccountKeyJson);

if (!serviceAccountKey) {
  console.log(serviceAccountKey);
  throw new Error("NEXT_PUBLIC_FIREBASE_ACCOUNT_KEY is not defined in .env");
}
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
  });
}
export const adminAuth: Auth = admin.auth();
