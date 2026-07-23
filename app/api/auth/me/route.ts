/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/database/prisma";
import { redis } from "@/app/lib/redis/client";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const cacheKey = `user:${session.user.id}`;

  try {
    //check redis
    const cached = await redis.get(cacheKey);
    if (cached) return NextResponse.json(JSON.parse(cached));

    const user = await prisma.users.findUnique({
      where: { user_id: Number(session.user.id) },
      select: {
        user_id: true,
        username: true,
        customer_id: true,
        Customers: {
          select: {
            customer_id: true,
            customer_name: true,
            mobile_number: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const responseUser = {
      user_id: user.user_id,
      customer_id: user.customer_id,
      username: user.username,
      name: user.Customers?.customer_name ?? null,
      mobile_number: user.Customers?.mobile_number ?? null,
    };

    await redis.set(cacheKey, JSON.stringify(responseUser), "EX", 600);

    return NextResponse.json(responseUser);
  } catch (err) {
    console.error("Failed to fetch current user:", err);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
