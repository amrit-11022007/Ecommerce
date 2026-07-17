/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/route";
import { db } from "@/app/lib/database/db";
import { getCustomerId } from "@/app/lib/auth/getCustomerId";

export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get("productId");
    if (!productId)
      return NextResponse.json(
        { message: "productId is required" },
        { status: 400 },
      );

    const [rows] = await db.query(
      `SELECT r.review_id, r.rating, r.review, r.comments, r.created_at, c.customer_name
       FROM Reviews r JOIN Customers c ON c.customer_id = r.customer_id
       WHERE r.product_id = ? ORDER BY r.created_at DESC`,
      [productId],
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json(
      { message: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    const { product_id, rating, review, comments } = await request.json();
    if (!product_id || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "product_id and rating (1-5) required" },
        { status: 400 },
      );
    }

    const customer_id = await getCustomerId(session.user.id);

    await db.query(
      "INSERT INTO Reviews (product_id, customer_id, rating, review, comments) VALUES (?, ?, ?, ?, ?)",
      [product_id, customer_id, rating, review ?? null, comments ?? null],
    );

    return NextResponse.json({ message: "Review added" });
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { message: "You've already reviewed this product" },
        { status: 409 },
      );
    }
    console.error("Failed to add review:", error);
    return NextResponse.json(
      { message: "Failed to add review" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id)
      return NextResponse.json({ message: "id is required" }, { status: 400 });

    const customer_id = await getCustomerId(session.user.id);

    const [result] = await db.query(
      "DELETE FROM Reviews WHERE review_id = ? AND customer_id = ?",
      [id, customer_id],
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ message: "Review deleted" });
  } catch (error) {
    console.error("Failed to delete review:", error);
    return NextResponse.json(
      { message: "Failed to delete review" },
      { status: 500 },
    );
  }
}
