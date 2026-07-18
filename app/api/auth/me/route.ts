/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/app/lib/database/db";
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

    //if not, get from db
    const [rows] = await db.query(
      `SELECT u.user_id, c.customer_id, u.username, c.customer_name AS name, c.mobile_number
       FROM Users u
       LEFT JOIN Customers c ON c.customer_id = u.customer_id
       WHERE u.user_id = ?`,
      [session.user.id],
    );

    const user = (rows as any[])[0];
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    //set into redis for next time
    await redis.set(cacheKey, JSON.stringify(user), "EX", 600);

    return NextResponse.json(user);
  } catch (err) {
    console.error("Failed to fetch current user:", err);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
