import { prisma } from "../database/prisma";

export async function getCustomerId(userId: string): Promise<string | null> {
  const user = await prisma.users.findUnique({
    where: { user_id: userId },
    select: { customer_id: true },
  });
  return user?.customer_id ?? null;
}
