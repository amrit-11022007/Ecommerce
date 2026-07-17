/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/app/lib/database/db";
import { ProductRow } from "@/app/types/definitions";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const limit = Number(params.get("limit")) || 10;
    const offset = Number(params.get("offset")) || 0;
    const category = params.get("category");
    const brand = params.get("brand");
    const q = params.get("q");
    const sort = params.get("sort");
    let query = "SELECT * FROM Products WHERE 1=1";
    const values: any[] = [];
    if (category) {
      query += " AND category = ?";
      values.push(category);
    }
    if (brand) {
      query += " AND brand = ?";
      values.push(brand);
    }
    if (q) {
      query += " AND product_name LIKE ?";
      values.push(`%${q}%`);
    }
    if (sort === "price_asc") query += " ORDER BY price ASC";
    if (sort === "price_desc") query += " ORDER BY price DESC";
    query += " LIMIT ? OFFSET ?";
    values.push(limit, offset);
    const [rows] = await db.query<ProductRow[]>(query, values);
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
