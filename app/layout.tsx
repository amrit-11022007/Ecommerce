import { getServerSession } from "next-auth";
import Navbar from "./components/Navbar";
import "./globals.css";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const id = await getId();
  return (
    <html lang="en">
      <body className="bg-[#F8F9FA]">
        <Navbar userId={id} />
        {children}
      </body>
    </html>
  );
}

async function getId() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (typeof userId !== "string" || userId.length === 0) {
      return undefined;
    }

    return userId;
  } catch (error) {
    console.error("Error occured: ", error);
    return undefined;
  }
}
