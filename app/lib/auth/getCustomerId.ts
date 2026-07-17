import { db } from "@/app/lib/database/db";

export async function getCustomerId(userId: string): Promise<number | null> {
  const [rows] = await db.query(
    "SELECT customer_id FROM Users WHERE user_id = ?",
    [userId],
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (rows as any[])[0]?.customer_id ?? null;
}
