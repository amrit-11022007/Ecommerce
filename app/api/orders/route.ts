/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/route";
import { getCustomerId } from "@/app/lib/auth/getCustomerId";
import { prisma } from "@/app/lib/database/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    const customer_id = await getCustomerId(session.user.id);
    const id = request.nextUrl.searchParams.get("id");
    if (customer_id === null) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 },
      );
    }

    if (!id) {
      const orders = await prisma.orders.findMany({
        where: {
          customer_id,
        },
        orderBy: {
          order_date: "desc",
        },
      });
      return NextResponse.json(orders);
    }

    const order = await prisma.orders.findFirst({
      where: {
        order_id: Number(id),
        customer_id,
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const items = await prisma.orderItems.findMany({
      where: {
        order_id: Number(id),
      },
      select: {
        order_item_id: true,
        order_id: true,
        product_id: true,
        count: true,
        amount: true,
        created_at: true,
        updated_at: true,
        Products: {
          select: {
            product_name: true,
          },
        },
      },
    });

    return NextResponse.json({
      ...order,
      items: items.map(({ Products, ...item }) => ({
        ...item,
        product_name: Products.product_name,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
