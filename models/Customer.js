// models/Customer.js
const db = require("../config/db");

const Customer = {
  getAll: (callback) => {
    const sql = "SELECT * FROM customers ORDER BY created_at DESC";
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = "SELECT * FROM customers WHERE id = ?";
    db.query(sql, [id], callback);
  },

  create: (data, callback) => {
    const sql =
      "INSERT INTO customers (name, gender, address, phone, instagram) VALUES (?, ?, ?, ?, ?)";
    db.query(
      sql,
      [data.name, data.gender, data.address, data.phone, data.instagram],
      callback
    );
  },

  update: (id, data, callback) => {
    const sql = `
      UPDATE customers 
      SET name = ?, gender = ?, address = ?, phone = ?, instagram = ?
      WHERE id = ?
    `;
    db.query(
      sql,
      [data.name, data.gender, data.address, data.phone, data.instagram, id],
      callback
    );
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM customers WHERE id = ?";
    db.query(sql, [id], callback);
  },
};

module.exports = Customer;
