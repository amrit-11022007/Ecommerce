/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/app/lib/database/prisma";

export async function POST(req: Request) {
  try {
    const { username, password, customer_name, mobile_number } =
      await req.json();

    const existingUser = await prisma.users.findUnique({
      where: { username },
      select: { user_id: true },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Username Taken" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);

    await prisma.$transaction(async (tx) => {
      const customer = await tx.customers.create({
        data: {
          customer_name,
          mobile_number,
        },
        select: {
          customer_id: true,
        },
      });

      await tx.users.create({
        data: {
          customer_id: customer.customer_id,
          username,
          password: hashed,
        },
      });
    });

    return NextResponse.json({ username });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
