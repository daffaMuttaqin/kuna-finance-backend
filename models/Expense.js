// models/Expense.js
const db = require("../config/db");

const Expense = {
  getAll: (callback) => {
    const sql = `
      SELECT expenses.*, users.name AS created_by_name
      FROM expenses
      LEFT JOIN users ON expenses.created_by = users.id
      ORDER BY expense_date DESC
    `;
    db.query(sql, callback);
  },

  // getById: (id, callback) => {
  //   const sql = "SELECT * FROM expenses WHERE id = ?";
  //   db.query(sql, [id], callback);
  // },

  getById: (id, callback) => {
    db.query("SELECT * FROM expenses WHERE id = ?", [id], (err, resData) => {
      if (err) return callback(err, null);
      callback(null, resData);
    });
  },

  create: (data, callback) => {
    const sql = `
      INSERT INTO expenses (item_name, category, expense_date, total_price, notes, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
      sql,
      [
        data.item_name,
        data.category,
        data.expense_date,
        data.total_price,
        data.notes,
        data.created_by,
      ],
      callback
    );
  },

  update: (id, data, callback) => {
    const sql = `
      UPDATE expenses
      SET item_name = ?, category = ?, expense_date = ?, total_price = ?, notes = ?
      WHERE id = ?
    `;
    db.query(
      sql,
      [
        data.item_name,
        data.category,
        data.expense_date,
        data.total_price,
        data.notes,
        id,
      ],
      callback
    );
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM expenses WHERE id = ?";
    db.query(sql, [id], callback);
  },

  // Ambil ringkasan pengeluaran bulanan berdasarkan kategori
  getMonthlySummaryByCategory: (month, year, callback) => {
    const query = `
    SELECT 
      category,
      SUM(total_price) AS total
    FROM expenses
    WHERE MONTH(expense_date) = ? AND YEAR(expense_date) = ?
    GROUP BY category
    ORDER BY category ASC
  `;
    db.query(query, [month, year], callback);
  },

  // models/Expense.js
  getExpensesByMonth: (month, year, callback) => {
    const query = `
    SELECT 
      e.id,
      e.item_name,
      e.category,
      e.expense_date,
      e.total_price,
      e.notes,
      e.created_by,
      e.created_at,
      u.name AS created_by_name
    FROM expenses e
    JOIN users u ON e.created_by = u.id
    WHERE MONTH(e.expense_date) = ? AND YEAR(e.expense_date) = ?
    ORDER BY e.expense_date DESC
  `;
    db.query(query, [month, year], callback);
  },
};

module.exports = Expense;
