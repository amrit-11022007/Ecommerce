import { getServerSession } from "next-auth";
import Navbar from "./components/Navbar";
import "./globals.css";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { db } from "./lib/database/db";
import { RowDataPacket } from "mysql2";

interface CartCount extends RowDataPacket {
  totalCartItems: number;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userInfoData = await userInfo();
  const userId = userInfoData?.userId;
  const totalCartItems = userInfoData?.totalCartItems ?? 0;

  return (
    <html lang="en">
      <body className="bg-[#F8F9FA]">
        <Navbar userId={userId} totalCartItems={totalCartItems} />
        {children}
      </body>
    </html>
  );
}

async function userInfo() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return { userId: undefined, totalCartItems: 0 };
    }

    const [rows] = await db.query<CartCount[]>(
      "SELECT COUNT(ci.cart_item_id) as totalCartItems FROM cartitems ci INNER JOIN cart c ON c.cart_id = ci.cart_id INNER JOIN users u ON u.customer_id = c.customer_id WHERE u.user_id = ?",
      [userId],
    );

    return {
      userId,
      totalCartItems: rows[0]?.totalCartItems ?? 0,
    };
  } catch (error) {
    console.error("Error occured: ", error);
    return { userId: undefined, totalCartItems: 0 };
  }
}
