import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/landing",
  },
});

export const config = {
  matcher: [
    "/home/:path*",
    "/payment/:path*",
    "/settings/:path*",
    "/transactions/:path*",
    "/wallet/:path*",
  ],
};
