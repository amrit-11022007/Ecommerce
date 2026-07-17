/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/route";
import { getCustomerId } from "@/app/lib/auth/getCustomerId";
import { db } from "@/app/lib/database/db";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    const customer_id = await getCustomerId(session.user.id);
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      const [orders] = await db.query(
        "SELECT * FROM Orders WHERE customer_id = ? ORDER BY order_date DESC",
        [customer_id],
      );
      return NextResponse.json(orders);
    }

    const [orderRows] = await db.query(
      "SELECT * FROM Orders WHERE order_id = ? AND customer_id = ?",
      [id, customer_id],
    );
    const order = (orderRows as any[])[0];
    if (!order)
      return NextResponse.json({ message: "Order not found" }, { status: 404 });

    const [items] = await db.query(
      `SELECT oi.*, p.product_name FROM OrderItems oi
       JOIN Products p ON p.product_id = oi.product_id
       WHERE oi.order_id = ?`,
      [id],
    );

    return NextResponse.json({ ...order, items });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
