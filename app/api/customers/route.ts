/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { redis } from "@/app/lib/redis/client";
import { authOptions } from "../auth/[...nextauth]/route";
import { getCustomerId } from "@/app/lib/auth/getCustomerId";
import { prisma } from "@/app/lib/database/prisma";

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

    const customer = await prisma.customers.findUnique({
      where: { customer_id: id },
    });

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
    if (!id) {
      return NextResponse.json(
        { message: "No customer profile linked" },
        { status: 400 },
      );
    }

    const { type, newData } = await request.json();
    const allowedFields = {
      customer_name: "customer_name",
      mobile_number: "mobile_number",
    } as const;

    const field = allowedFields[type as keyof typeof allowedFields];
    if (!field) {
      return NextResponse.json(
        { message: "Invalid field type" },
        { status: 400 },
      );
    }

    await prisma.customers.update({
      where: { customer_id: id },
      data: {
        [field]: newData,
      },
    });

    await redis.del(`user:${session.user.id}`);
    await redis.del(`customer:${session.user.id}`);
    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Failed to update" }, { status: 500 });
  }
}
