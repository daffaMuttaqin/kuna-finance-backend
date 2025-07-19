// models/Income.js
const db = require("../config/db");

const Income = {
  getAll: (callback) => {
    const sql = `
      SELECT incomes.*, customers.name AS customer_name
      FROM incomes
      LEFT JOIN customers ON incomes.customer_id = customers.id
      ORDER BY incomes.purchase_date DESC
    `;
    db.query(sql, callback);
  },

  create: (data, callback) => {
    const sql = `
      INSERT INTO incomes (item_name, customer_id, purchase_date, total_price, notes, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
      sql,
      [
        data.item_name,
        data.customer_id || null,
        data.purchase_date,
        data.total_price,
        data.notes || null,
        data.created_by,
      ],
      callback
    );
  },

  update: (id, data, callback) => {
    const sql = `
      UPDATE incomes
      SET item_name = ?, customer_id = ?, purchase_date = ?, total_price = ?, notes = ?
      WHERE id = ?
    `;
    db.query(
      sql,
      [
        data.item_name,
        data.customer_id || null,
        data.purchase_date,
        data.total_price,
        data.notes || null,
        id,
      ],
      callback
    );
  },

  delete: (id, callback) => {
    const sql = `DELETE FROM incomes WHERE id = ?`;
    db.query(sql, [id], callback);
  },
};

module.exports = Income;
