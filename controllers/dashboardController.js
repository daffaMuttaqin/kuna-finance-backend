// controllers/dashboardController.js
const db = require("../config/db");

// Fungsi bantu format tanggal (hari ini & bulan ini)
const today = new Date().toISOString().slice(0, 10); // "2025-07-18"
const currentMonth = new Date().toISOString().slice(0, 7); // "2025-07"

exports.getDashboardSummary = (req, res) => {
  const queries = {
    incomeToday: `SELECT SUM(total_price) AS total FROM incomes WHERE DATE(purchase_date) = ?`,
    incomeMonth: `SELECT SUM(total_price) AS total FROM incomes WHERE DATE_FORMAT(purchase_date, '%Y-%m') = ?`,
    expenseToday: `SELECT SUM(total_price) AS total FROM expenses WHERE DATE(expense_date) = ?`,
    expenseMonth: `SELECT SUM(total_price) AS total FROM expenses WHERE DATE_FORMAT(expense_date, '%Y-%m') = ?`,
  };

  const results = {};

  db.query(queries.incomeToday, [today], (err, rows1) => {
    if (err) return res.status(500).json({ message: "Error incomeToday" });
    results.incomeToday = rows1[0].total || 0;

    db.query(queries.incomeMonth, [currentMonth], (err, rows2) => {
      if (err) return res.status(500).json({ message: "Error incomeMonth" });
      results.incomeMonth = rows2[0].total || 0;

      db.query(queries.expenseToday, [today], (err, rows3) => {
        if (err) return res.status(500).json({ message: "Error expenseToday" });
        results.expenseToday = rows3[0].total || 0;

        db.query(queries.expenseMonth, [currentMonth], (err, rows4) => {
          if (err)
            return res.status(500).json({ message: "Error expenseMonth" });
          results.expenseMonth = rows4[0].total || 0;

          res.json(results);
        });
      });
    });
  });
};
