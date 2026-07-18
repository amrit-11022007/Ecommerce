/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { db } from "@/app/lib/database/db";
import { redis } from "@/app/lib/redis/client";
import { authOptions } from "../auth/[...nextauth]/route";
import { getCustomerId } from "@/app/lib/auth/getCustomerId";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  const cacheCustomerKey = `customer:${session.user.id}`;
  try {
    const cached = await redis.get(cacheCustomerKey);
    if (cached) return NextResponse.json(JSON.parse(cached));

    const id = await getCustomerId(session.user.id);
    if (!id) {
      return NextResponse.json(
        { message: "No customer profile linked" },
        { status: 400 },
      );
    }

    const [rows] = await db.query(
      "SELECT * FROM Customers WHERE customer_id = ?",
      [id],
    );
    const customer = (rows as any[])[0];
    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 },
      );
    }
    await redis.set(cacheCustomerKey, JSON.stringify(customer), "EX", 600);
    return NextResponse.json(customer);
  } catch (error) {
    console.error("Failed to fetch customer:", error);
    return NextResponse.json(
      { message: "Failed to get data" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  try {
    const id = await getCustomerId(session.user.id);
    const { type, newData } = await request.json();
    const allowedFields: Record<string, string> = {
      customer_name: "customer_name",
      mobile_number: "mobile_number",
    };
    const column = allowedFields[type];
    if (!column) {
      return NextResponse.json(
        { message: "Invalid field type" },
        { status: 400 },
      );
    }
    const [result] = await db.query(
      `UPDATE Customers SET ${column} = ? WHERE customer_id = ?`,
      [newData, id],
    );
    const affectedRows = (result as any).affectedRows;
    if (affectedRows === 0) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 },
      );
    }
    await redis.del(`user:${session.user.id}`);
    await redis.del(`customer:${session.user.id}`);
    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Failed to update" }, { status: 500 });
  }
}
