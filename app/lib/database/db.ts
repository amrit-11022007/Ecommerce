import mysql from "mysql2/promise";

// 1. Setup MySQL2 Pool (Keep this outside the request handler so it's reused)
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
});
