import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCustomerId } from "@/app/lib/auth/getCustomerId";
import { prisma } from "@/app/lib/database/prisma";
import { cartSchema } from "@/app/lib/validation/schema";

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

    const cart = await prisma.cart.findFirst({
      where: { customer_id },
      select: { cart_id: true },
    });

    if (!cart)
      return NextResponse.json({ cart_id: null, items: [], totalItems: 0 });

    const items = await prisma.cartItems.findMany({
      where: { cart_id: cart.cart_id },
      select: {
        cart_item_id: true,
        product_id: true,
        quantity: true,
        price: true,
        Products: {
          select: {
            product_name: true,
            brand: true,
            Inventory: {
              select: { available_count: true },
              take: 1,
            },
          },
        },
      },
    });

    const mappedItems = items.map((item) => ({
      cart_item_id: item.cart_item_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      product_name: item.Products.product_name,
      brand: item.Products.brand,
      available_count: item.Products.Inventory[0]?.available_count ?? 0,
    }));

    const totalItems = mappedItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    return NextResponse.json({
      cart_id: cart.cart_id,
      items: mappedItems,
      totalItems,
    });
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
    const body = await request.json();
    const parsed = cartSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const { product_id, quantity } = parsed.data;

    const customer_id = await getCustomerId(session.user.id);
    if (!customer_id)
      return NextResponse.json(
        { message: "No customer profile linked" },
        { status: 400 },
      );

    const product = await prisma.products.findUnique({
      where: { product_id },
      select: {
        price: true,
        Inventory: {
          select: { available_count: true },
          take: 1,
        },
      },
    });

    if (!product)
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );

    const cart = await prisma.cart.findFirst({
      where: { customer_id },
      select: { cart_id: true },
    });

    const cart_id =
      cart?.cart_id ??
      (
        await prisma.cart.create({
          data: { customer_id },
          select: { cart_id: true },
        })
      ).cart_id;

    await prisma.cartItems.upsert({
      where: {
        cart_id_product_id: {
          cart_id,
          product_id,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        cart_id,
        product_id,
        quantity,
        price: product.price,
      },
    });

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
    if (!quantity || quantity < 1 || quantity > 10)
      return NextResponse.json(
        { message: "quantity must be between 1 and 10" },
        { status: 400 },
      );

    const customer_id = await getCustomerId(session.user.id);
    if (!customer_id)
      return NextResponse.json(
        { message: "No customer profile linked" },
        { status: 400 },
      );

    const product = await prisma.products.findUnique({
      where: { product_id: id },
      select: {
        Inventory: {
          select: { available_count: true },
          take: 1,
        },
      },
    });

    const available = product?.Inventory[0]?.available_count ?? 0;

    if (quantity > available) {
      return NextResponse.json(
        {
          message: "Not enough stock",
          available_count: available,
        },
        { status: 400 },
      );
    }

    const result = await prisma.cartItems.updateMany({
      where: {
        product_id: id,
        Cart: { customer_id },
      },
      data: { quantity },
    });

    if (result.count === 0) {
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
    if (!customer_id)
      return NextResponse.json(
        { message: "No customer profile linked" },
        { status: 400 },
      );

    const result = await prisma.cartItems.deleteMany({
      where: {
        product_id: id,
        Cart: { customer_id },
      },
    });

    if (result.count === 0) {
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
