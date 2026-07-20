import { withAuth } from "next-auth/middleware";

export default withAuth({ pages: { signIn: "/login" } });

export const config = {
  matcher: ["/orders/:path*", "/cart/:path*", "/account/:path*"],
};
