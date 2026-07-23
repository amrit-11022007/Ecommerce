import { prisma } from "../database/prisma";

export async function getCustomerId(userId: string): Promise<number | null> {
  const user = await prisma.users.findUnique({
    where: { user_id: Number(userId) },
    select: { customer_id: true },
  });
  return user?.customer_id ?? null;
}
