// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Cek root
app.get("/", (req, res) => {
  res.send("Kuna Patisserie API is running...");
});

// Connect DB
const db = require("./config/db");

// TODO: Tambahkan routes di sini
// login dan register
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// input data pemasukan
const incomeRoutes = require("./routes/incomeRoutes");
app.use("/api/incomes", incomeRoutes);

//  input data customer
const customerRoutes = require("./routes/customerRoutes");
app.use("/api/customers", customerRoutes);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
