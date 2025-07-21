// models/User.js
const db = require("../config/db");

const User = {
  findByEmail: (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], callback);
  },

  createAdmin: (data, callback) => {
    const sql =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')";
    db.query(sql, [data.name, data.email, data.password], callback);
  },

  getById: (id, callback) => {
    const sql = "SELECT id, name, email, role FROM users WHERE id = ?";
    db.query(sql, [id], callback);
  },

  updateSelf: (id, data, callback) => {
    const sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
    db.query(sql, [data.name, data.email, id], callback);
  },

  updatePassword: (id, hashedPassword, callback) => {
    const sql = "UPDATE users SET password = ? WHERE id = ?";
    db.query(sql, [hashedPassword, id], callback);
  },

  getAllAdmins: (callback) => {
    const sql = "SELECT id, name, email FROM users WHERE role = 'admin'";
    db.query(sql, callback);
  },

  updateAdminById: (id, data, callback) => {
    const sql =
      "UPDATE users SET name = ?, email = ? WHERE id = ? AND role = 'admin'";
    db.query(sql, [data.name, data.email, id], callback);
  },
};

module.exports = User;
