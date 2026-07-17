/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/app/lib/database/db";
import { getCustomerId } from "@/app/lib/auth/getCustomerId";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    const customer_id = await getCustomerId(session.user.id);
    if (!customer_id)
      return NextResponse.json(
        { message: "No customer profile linked" },
        { status: 400 },
      );

    const [cartRows] = await db.query(
      "SELECT cart_id FROM Cart WHERE customer_id = ?",
      [customer_id],
    );
    const cart = (cartRows as any[])[0];
    if (!cart) return NextResponse.json({ cart_id: null, items: [] });

    const [items] = await db.query(
      `SELECT ci.cart_item_id, ci.product_id, ci.quantity, ci.price, p.product_name, p.brand
       FROM CartItems ci JOIN Products p ON p.product_id = ci.product_id
       WHERE ci.cart_id = ?`,
      [cart.cart_id],
    );

    return NextResponse.json({ cart_id: cart.cart_id, items });
  } catch (error) {
    console.error("Failed to fetch cart:", error);
    return NextResponse.json(
      { message: "Failed to get cart" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    const { product_id, quantity } = await request.json();
    if (!product_id || !quantity || quantity < 1) {
      return NextResponse.json(
        { message: "product_id and quantity (>=1) required" },
        { status: 400 },
      );
    }

    const customer_id = await getCustomerId(session.user.id);
    if (!customer_id)
      return NextResponse.json(
        { message: "No customer profile linked" },
        { status: 400 },
      );

    const [productRows] = await db.query(
      "SELECT price FROM Products WHERE product_id = ?",
      [product_id],
    );
    const product = (productRows as any[])[0];
    if (!product)
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );

    const [cartRows] = await db.query(
      "SELECT cart_id FROM Cart WHERE customer_id = ?",
      [customer_id],
    );
    let cart = (cartRows as any[])[0];
    if (!cart) {
      const [result] = await db.query(
        "INSERT INTO Cart (customer_id) VALUES (?)",
        [customer_id],
      );
      cart = { cart_id: (result as any).insertId };
    }
    await db.query(
      `INSERT INTO CartItems (cart_id, product_id, quantity, price)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [cart.cart_id, product_id, quantity, product.price],
    );

    return NextResponse.json({ message: "Added to cart" });
  } catch (error) {
    console.error("Failed to add to cart:", error);
    return NextResponse.json(
      { message: "Failed to add to cart" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id)
      return NextResponse.json({ message: "id is required" }, { status: 400 });

    const { quantity } = await request.json();
    if (!quantity || quantity < 1)
      return NextResponse.json(
        { message: "quantity must be >= 1" },
        { status: 400 },
      );

    const customer_id = await getCustomerId(session.user.id);

    const [result] = await db.query(
      `UPDATE CartItems ci
       JOIN Cart c ON c.cart_id = ci.cart_id
       SET ci.quantity = ?
       WHERE ci.cart_item_id = ? AND c.customer_id = ?`,
      [quantity, id, customer_id],
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { message: "Cart item not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ message: "Updated" });
  } catch (error) {
    console.error("Failed to update cart item:", error);
    return NextResponse.json({ message: "Failed to update" }, { status: 500 });
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
      `DELETE ci FROM CartItems ci
       JOIN Cart c ON c.cart_id = ci.cart_id
       WHERE ci.cart_item_id = ? AND c.customer_id = ?`,
      [id, customer_id],
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { message: "Cart item not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ message: "Removed" });
  } catch (error) {
    console.error("Failed to remove cart item:", error);
    return NextResponse.json({ message: "Failed to remove" }, { status: 500 });
  }
}
