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

  getById: (id, callback) => {
    const sql = "SELECT * FROM expenses WHERE id = ?";
    db.query(sql, [id], callback);
  },

  create: (data, callback) => {
    const sql = `
      INSERT INTO expenses (item_name, expense_date, total_price, notes, created_by)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(
      sql,
      [
        data.item_name,
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
      SET item_name = ?, expense_date = ?, total_price = ?, notes = ?
      WHERE id = ?
    `;
    db.query(
      sql,
      [data.item_name, data.expense_date, data.total_price, data.notes, id],
      callback
    );
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM expenses WHERE id = ?";
    db.query(sql, [id], callback);
  },
};

module.exports = Expense;
