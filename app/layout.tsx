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
    console.log(session);
    const userId = session?.user?.id;

    return userId;
  } catch (error) {
    console.error("Error occured: ", error);
    return undefined;
  }
}
