const db = require("../config/db");

exports.getActivityLogs = (req, res) => {
  const sql = `
    SELECT logs.*, users.name 
    FROM activity_logs logs 
    JOIN users ON logs.user_id = users.id
    ORDER BY logs.timestamp DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ message: "Gagal mengambil log aktivitas" });
    }

    res.json(results);
  });
};
