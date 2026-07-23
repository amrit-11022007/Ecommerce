/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/app/lib/database/prisma";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const limit = Number(params.get("limit")) || 10;
    const offset = Number(params.get("offset")) || 0;
    const category = params.get("category");
    const brand = params.get("brand");
    const identifier = params.get("identifier");
    const q = params.get("q");
    const sort = params.get("sort");

    const where: {
      OR?: Array<{
        brand?: { contains: string };
        product_name?: { contains: string };
        category?: { contains: string };
      }>;
      category?: string;
      brand?: string;
      product_name?: { contains: string };
    } = {};

    if (identifier) {
      where.OR = [
        { brand: { contains: identifier } },
        { product_name: { contains: identifier } },
        { category: { contains: identifier } },
      ];
    } else {
      if (category) {
        where.category = category;
      }
      if (brand) {
        where.brand = brand;
      }
    }

    if (q) {
      where.product_name = { contains: q };
    }

    const orderBy =
      sort === "price_asc"
        ? { price: "asc" as const }
        : sort === "price_desc"
          ? { price: "desc" as const }
          : undefined;

    const rows = await prisma.products.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
    });

    if (rows.length === 0)
      return NextResponse.json({ message: "No data found" });

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { message: "Failed to get data" },
      { status: 500 },
    );
  }
}
