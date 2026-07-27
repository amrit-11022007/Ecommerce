// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/database/prisma";
import { registerSchema } from "@/app/lib/validation/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const {
      username,
      password,
      customer_name,
      mobile_number,
      city,
      state,
      country,
    } = parsed.data;

    const existingUser = await prisma.users.findUnique({
      where: { username },
      select: { user_id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 },
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    await prisma.$transaction(async (tx) => {
      const customer = await tx.customers.create({
        data: { customer_name, mobile_number },
        select: { customer_id: true },
      });

      await tx.customer_address.create({
        data: { customer_id: customer.customer_id, city, state, country },
      });

      await tx.users.create({
        data: { customer_id: customer.customer_id, username, password: hashed },
      });
    });

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 },
    );
  } catch (err) {
    console.error("Registration failed:", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
