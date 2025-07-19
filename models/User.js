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
};

module.exports = User;
