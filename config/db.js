// config/db.js
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

let pool;

if (process.env.DATABASE_URL) {
  // Mode production (misal Vercel / Railway)
  pool = mysql.createPool({
    uri: process.env.DATABASE_URL + "?allowPublicKeyRetrieval=true&ssl=false",
  });
  console.log("✅ Using DATABASE_URL for connection");
} else {
  // Mode development (lokal, misal XAMPP)
  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "railway",
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  console.log("✅ Using local DB connection");
}

module.exports = pool;
