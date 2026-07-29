import { db } from "@/app/lib/database/db";
import { UserPageProps } from "@/app/types/definitions";
import { RowDataPacket } from "mysql2";
import Link from "next/link";
import { redis } from "@/app/lib/redis/client";
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  ShoppingBag,
  Heart,
  Settings,
  Package,
  ChevronRight,
  Edit3,
  ShoppingCart,
} from "lucide-react";
import WishlistBox from "@/app/components/WishListBox";

interface UserData extends RowDataPacket {
  username: string;
  customer_name: string;
  mobile_number: string;
  city: string;
  state: string;
  country: string;
  product_name: string;
  price: number;
  product_id: string;
  created_at: string;
}

export default async function UserPage({ params }: UserPageProps) {
  const user = await params;

  const cacheKey = `user:${user.id}`;
  const cached = await redis.get(cacheKey);

  let userData: UserData | null = null;
  let cartItems: UserData[] = [];

  if (cached) {
    const parsed = JSON.parse(cached);
    userData = parsed.userData;
    cartItems = parsed.cartItems;
  } else {
    const [rows] = await db.query<UserData[]>(
      `SELECT 
        u.username, 
        c.customer_name, 
        c.mobile_number, 
        ca.city, 
        ca.state, 
        ca.country,
        p.product_name,
        p.price,
        p.product_id,
        ci.created_at
      FROM Users u 
      LEFT JOIN Customers c ON c.customer_id = u.customer_id 
      INNER JOIN Customer_address ca ON ca.customer_id = c.customer_id
      LEFT JOIN cart cr ON cr.customer_id = c.customer_id
      LEFT JOIN cartitems ci ON ci.cart_id = cr.cart_id
      LEFT JOIN products p ON p.product_id = ci.product_id
      WHERE u.user_id = ?
      ORDER BY ci.created_at DESC`,
      [user.id],
    );

    if (rows.length > 0) {
      userData = rows[0];
      cartItems = rows.filter((row) => row.product_id !== null);
    }

    await redis.set(
      cacheKey,
      JSON.stringify({ userData, cartItems }),
      "EX",
      600,
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#F0F8FF] via-white to-[#F8F0FF]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-linear-to-br from-[#2874F0]/10 to-[#6C63FF]/10 mb-6">
            <User size={48} className="text-[#6C63FF]" />
          </div>
          <h1 className="text-7xl font-bold text-[#2D3436] mb-4">404</h1>
          <p className="text-xl text-gray-500 font-medium mb-8">
            Profile not found
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-[#2874F0] to-[#6C63FF] text-white rounded-2xl font-semibold shadow-xl shadow-[#6C63FF]/30 hover:shadow-2xl hover:shadow-[#6C63FF]/40 hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft size={20} />
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F0F8FF]/30 via-white to-white">
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#6C63FF] transition-colors duration-300 mb-8 group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform duration-300"
          />
          <span className="font-medium">Back to Shop</span>
        </Link>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-[#6C63FF]/5 border border-gray-100 overflow-hidden">
          <div className="relative h-40 bg-linear-to-r from-[#2874F0] via-[#6C63FF] to-[#FF9F43]">
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute -bottom-16 left-10">
              <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-2xl flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-linear-to-br from-[#F0F8FF] to-[#F8F0FF] flex items-center justify-center">
                  <span className="text-5xl font-bold bg-linear-to-r from-[#2874F0] to-[#6C63FF] bg-clip-text text-transparent">
                    {userData.username?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              </div>
            </div>
            <button className="absolute top-6 right-6 flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-2xl text-white font-medium hover:bg-white/30 transition-all duration-300 border border-white/20">
              <Edit3 size={16} />
              Edit Profile
            </button>
          </div>

          <div className="pt-20 px-10 pb-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div>
                <h1 className="text-3xl font-bold text-[#2D3436] tracking-tight">
                  {userData.customer_name || userData.username}
                </h1>
                <p className="text-lg text-gray-500 font-medium mt-1">
                  @{userData.username}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-2xl">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-green-600">
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="flex items-center gap-4 rounded-2xl bg-linear-to-br from-[#F0F8FF] to-[#F8F9FA] p-5 border border-gray-100 hover:shadow-lg hover:border-[#6C63FF]/20 transition-all duration-300 group">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Phone size={24} className="text-[#2874F0]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Mobile
                  </p>
                  <p className="text-base font-bold text-[#2D3436] mt-1">
                    {userData.mobile_number || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-linear-to-br from-[#FFF5E7] to-[#FFF8F0] p-5 border border-gray-100 hover:shadow-lg hover:border-[#FF9F43]/20 transition-all duration-300 group">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md group-hover:scale-110 transition-transform duration-300">
                  <MapPin size={24} className="text-[#FF9F43]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Location
                  </p>
                  <p className="text-base font-bold text-[#2D3436] mt-1">
                    {[userData.city, userData.state, userData.country]
                      .filter(Boolean)
                      .join(", ") || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-linear-to-br from-[#F0FFF4] to-[#F5FFF8] p-5 border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all duration-300 group">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Settings size={24} className="text-green-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Account
                  </p>
                  <p className="text-base font-bold text-[#2D3436] mt-1">
                    Verified
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-10">
              <button className="flex items-center gap-3 px-7 py-4 bg-linear-to-r from-[#2874F0] to-[#6C63FF] text-white rounded-2xl font-semibold shadow-xl shadow-[#6C63FF]/30 hover:shadow-2xl hover:shadow-[#6C63FF]/40 hover:scale-105 transition-all duration-300">
                <ShoppingBag size={20} />
                View Orders
              </button>
              <button className="flex items-center gap-3 px-7 py-4 border-2 border-gray-200 rounded-2xl text-[#2D3436] font-semibold hover:border-[#FF6B6B]/30 hover:bg-red-50 hover:text-red-500 transition-all duration-300 group">
                <Heart
                  size={20}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                Wishlist
              </button>
              <button className="flex items-center gap-3 px-7 py-4 border-2 border-gray-200 rounded-2xl text-[#2D3436] font-semibold hover:border-[#6C63FF]/30 hover:bg-[#F0F8FF] transition-all duration-300">
                <Settings size={20} />
                Settings
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-[#6C63FF]/5 border border-gray-100">
            <h2 className="text-xl font-bold text-[#2D3436] mb-6 flex items-center gap-3">
              <Package size={24} className="text-[#6C63FF]" />
              Cart Items
            </h2>
            {cartItems && cartItems.length > 0 ? (
              <div className="max-h-85 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {cartItems.map((item) => (
                  <Link
                    key={item.product_id}
                    href={`/products/${item.product_id}`}
                    className="flex items-center gap-4 rounded-2xl bg-linear-to-br from-[#F0F8FF] to-[#F8F0FF] p-4 hover:shadow-md hover:scale-[1.02] transition-all duration-300 group"
                  >
                    <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                      <ShoppingCart size={24} className="text-[#6C63FF]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#2D3436] truncate group-hover:text-[#2874F0] transition-colors">
                        {item.product_name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-lg font-bold text-[#2874F0]">
                          ₹{Number(item.price).toLocaleString("en-IN")}
                        </p>
                        <span className="text-xs text-gray-400">
                          {new Date(item.created_at).toLocaleDateString(
                            "en-IN",
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-gray-300 group-hover:text-[#6C63FF] group-hover:translate-x-1 transition-all duration-300"
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-[#F0F8FF] to-[#F8F0FF] mb-4">
                  <Package size={32} className="text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">No items in cart</p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 mt-4 text-[#6C63FF] font-semibold hover:text-[#2874F0] transition-colors duration-300 group"
                >
                  Start Shopping
                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </Link>
              </div>
            )}
          </div>
          <WishlistBox />
        </div>
      </div>
    </div>
  );
}
