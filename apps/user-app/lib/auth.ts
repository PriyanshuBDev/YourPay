import CredentialsProvider from "next-auth/providers/credentials";
import { Session, SessionStrategy, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { adminAuth } from "../lib/firebaseAdmin";
import prisma from "@repo/db/client";
// import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        idToken: { label: "ID Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.idToken) {
          console.log("❌ No idToken");
          return null;
        }
        try {
          const decoded = await adminAuth.verifyIdToken(credentials.idToken);
          const uid = decoded.uid;
          const email = decoded.email;
          const user = await prisma.user.findUnique({
            where: {
              id: uid,
            },
            select: {
              username: true,
            },
          });
          return {
            id: uid,
            name: user?.username,
            email,
          };
        } catch (e) {
          console.error("Firebase ID token verification failed:", e);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" as SessionStrategy },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) token.sub = user.id;
      return token;
    },
    session: async ({ session, token }: { session: Session; token: JWT }) => {
      if (token?.sub) {
        session.user.uid = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};
