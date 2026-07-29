// app/cart/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCustomerId } from "@/app/lib/auth/getCustomerId";
import { prisma } from "@/app/lib/database/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, ChevronRight } from "lucide-react";
import CartItemCard from "@/app/components/CardItemCard";

export default async function CartPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const customer_id = await getCustomerId(session.user.id);
  if (!customer_id) redirect("/login");

  const cart = await prisma.cart.findFirst({
    where: { customer_id },
    select: { cart_id: true },
  });

  let items: {
    product_id: string;
    quantity: number;
    price: number;
    inStock: boolean;
  }[] = [];
  let totalItems = 0;

  if (cart) {
    const cartItems = await prisma.cartItems.findMany({
      where: { cart_id: cart.cart_id },
      select: {
        product_id: true,
        quantity: true,
        price: true,
        Products: {
          select: {
            Inventory: {
              select: { available_count: true },
              take: 1,
            },
          },
        },
      },
    });
    items = cartItems.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: Number(item.price),
      inStock: (item.Products.Inventory[0]?.available_count ?? 0) > 0,
    }));
    totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  const subtotal = items
    .filter((item) => item.inStock)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 499 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen bg-linear-to-b from-[#F0F8FF]/30 via-white to-white">
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#6C63FF] transition-colors duration-300 mb-8 group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform duration-300"
          />
          <span className="font-medium">Continue Shopping</span>
        </Link>

        <h1 className="text-4xl font-bold text-[#2D3436] mb-2">
          Shopping Cart
        </h1>
        <p className="text-gray-500 mb-10">{totalItems} items in your cart</p>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-4">
            {items.length > 0 ? (
              items.map((item) => (
                <CartItemCard
                  key={item.product_id}
                  product_id={item.product_id}
                />
              ))
            ) : (
              <div className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-gray-100 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-linear-to-br from-[#F0F8FF] to-[#F8F0FF] mb-6">
                  <ShoppingBag size={40} className="text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold text-[#2D3436] mb-2">
                  Your cart is empty
                </h2>
                <p className="text-gray-500 mb-8">
                  Looks like you haven&apos;t added anything yet.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-[#2874F0] to-[#6C63FF] text-white rounded-2xl font-semibold shadow-xl shadow-[#6C63FF]/30 hover:shadow-2xl hover:shadow-[#6C63FF]/40 transition-all duration-300"
                >
                  Browse Products
                  <ChevronRight size={20} />
                </Link>
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#2D3436] mb-6">
                  Order Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold text-[#2D3436]">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-semibold text-[#2D3436]">
                      {shipping === 0 ? (
                        <span className="text-green-500">Free</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-[#6C63FF] font-medium">
                      Add ₹{(499 - subtotal).toLocaleString("en-IN")} more for
                      free shipping
                    </p>
                  )}
                  <div className="border-t border-gray-100 pt-4 flex justify-between">
                    <span className="text-base font-bold text-[#2D3436]">
                      Total
                    </span>
                    <span className="text-xl font-bold text-[#2D3436]">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
                <button className="w-full mt-8 px-6 py-4 bg-linear-to-r from-[#2874F0] to-[#6C63FF] text-white rounded-2xl font-semibold shadow-xl shadow-[#6C63FF]/30 hover:shadow-2xl hover:shadow-[#6C63FF]/40 transition-all duration-300">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
