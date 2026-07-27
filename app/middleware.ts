import { withAuth } from "next-auth/middleware";
import Redis from "ioredis";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

async function rateLimit(ip: string): Promise<{
  success: boolean;
  remaining: number;
}> {
  const key = `ratelimit:${ip}`;
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, 60);
  }
  const ttl = await redis.ttl(key);
  return {
    success: current <= 5,
    remaining: Math.max(0, 5 - current),
  };
}

export default withAuth(
  async function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.startsWith("/api/auth")) {
      const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
      const { success, remaining } = await rateLimit(ip);

      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Try again later." },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": "5",
              "X-RateLimit-Remaining": remaining.toString(),
              "Retry-After": "60",
            },
          },
        );
      }
    }

    return NextResponse.next();
  },
  { pages: { signIn: "/login" } },
);

export const config = {
  matcher: [
    "/orders/:path*",
    "/cart/:path*",
    "/user/:path*",
    "/api/auth/:path*",
  ],
};
