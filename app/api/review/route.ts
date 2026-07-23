/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/route";
import { getCustomerId } from "@/app/lib/auth/getCustomerId";
import { prisma } from "@/app/lib/database/prisma";

export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get("productId");
    if (!productId)
      return NextResponse.json(
        { message: "productId is required" },
        { status: 400 },
      );

    const rows = await prisma.reviews.findMany({
      where: {
        product_id: Number(productId),
      },
      orderBy: {
        created_at: "desc",
      },
      select: {
        review_id: true,
        rating: true,
        review: true,
        comments: true,
        created_at: true,
        Customers: {
          select: {
            customer_name: true,
          },
        },
      },
    });

    return NextResponse.json(
      rows.map(({ Customers, ...review }) => ({
        ...review,
        customer_name: Customers.customer_name,
      })),
    );
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
    if (!customer_id) {
      return NextResponse.json(
        { message: "No customer profile linked" },
        { status: 400 },
      );
    }

    await prisma.reviews.create({
      data: {
        product_id: Number(product_id),
        customer_id,
        rating: Number(rating),
        review: review ?? null,
        comments: comments ?? null,
      },
    });

    return NextResponse.json({ message: "Review added" });
  } catch (error: any) {
    if (error?.code === "P2002") {
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
    if (!customer_id) {
      return NextResponse.json(
        { message: "No customer profile linked" },
        { status: 400 },
      );
    }

    const result = await prisma.reviews.deleteMany({
      where: {
        review_id: Number(id),
        customer_id,
      },
    });

    if (result.count === 0) {
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
