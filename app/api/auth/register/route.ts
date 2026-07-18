/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { db } from "@/app/lib/database/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const [rows] = await db.query("SELECT DATABASE()");
    console.log(rows);

    const [tables] = await db.query("SHOW TABLES");
    console.log(tables);
    const { username, password, customer_name, mobile_number } =
      await req.json();
    const [existing] = await db.query(
      "SELECT user_id FROM Users WHERE username = ?",
      [username],
    );
    if ((existing as any[]).length > 0) {
      return NextResponse.json({ error: "Username Taken" }, { status: 409 });
    }
    const [customerResult] = await db.query(
      "INSERT INTO Customers (customer_name, mobile_number) VALUES (?, ?)",
      [customer_name, mobile_number],
    );
    const customer_id = (customerResult as any).insertId;
    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO Users (customer_id, username, password) VALUES (?, ?, ?)",
      [customer_id, username, hashed],
    );
    return NextResponse.json({ username });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
