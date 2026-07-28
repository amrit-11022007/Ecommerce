import mysql from "mysql2/promise";

declare global {
  var dbPool: mysql.Pool | undefined;
}

// 1. Setup MySQL2 Pool (Keep this outside the request handler so it's reused)
const pool =
  globalThis.dbPool ??
  mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "aristotle",
    database: process.env.DB_DATABASE || "ecommerce",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

if (process.env.NODE_ENV === "development") {
  globalThis.dbPool = pool;
}

export const db = pool;
