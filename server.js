// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cron = require("node-cron");
const runMonthlyOmzetCheck = require("./jobs/monthlyOmzetCheck");

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

// Input data pemasukan
const incomeRoutes = require("./routes/incomeRoutes");
app.use("/api/incomes", incomeRoutes);

//  Input data Pengeluaran
const expenseRoutes = require("./routes/expenseRoutes");
app.use("/api/expenses", expenseRoutes);

//  Input data customer
const customerRoutes = require("./routes/customerRoutes");
app.use("/api/customers", customerRoutes);

// Dashboard
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

// Export to Excel
const reportRoutes = require("./routes/reportRoutes");
app.use("/api/reports", reportRoutes);

// Activity Logs
const activityRoutes = require("./routes/activityRoutes");
app.use("/api/activity", activityRoutes);

// Update data Admin
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

cron.schedule("0 18 * * *", () => {
  console.log("⏰ Menjalankan pengecekan omzet otomatis...");
  runMonthlyOmzetCheck(); // fungsi cek dan kirim email
});
