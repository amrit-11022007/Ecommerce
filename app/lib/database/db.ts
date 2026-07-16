import mysql from "mysql2/promise";

// 1. Setup MySQL2 Pool (Keep this outside the request handler so it's reused)
export const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "aristotle",
  database: process.env.DB_DATABASE || "ecommerce",
  waitForConnections: true,
  connectionLimit: 10,
});
