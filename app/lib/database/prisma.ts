import "server-only";
import "dotenv/config";

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

declare global {
  var prisma: PrismaClient | undefined;
}

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_DATABASE!,
});

export const prisma = globalThis.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV === "development") {
  globalThis.prisma = prisma;
}
