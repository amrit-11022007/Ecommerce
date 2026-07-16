/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/app/lib/database/db";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const id = params.get("id");
    if (!id) {
      return NextResponse.json({ message: "id is required" }, { status: 400 });
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
  try {
    const params = request.nextUrl.searchParams;
    const id = params.get("id");
    if (!id) {
      return NextResponse.json({ message: "id is required" }, { status: 400 });
    }
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
    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Failed to update" }, { status: 500 });
  }
}
