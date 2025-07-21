// jobs/monthlyOmzetCheck.js
const db = require("../config/db");
const sendEmail = require("../utils/sendEmail");

const runMonthlyOmzetCheck = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Januari = 0
  const startDate = `${year}-${month}-01`;
  const endDate = `${year}-${month}-31`;
  const target = parseInt(process.env.TARGET_OMZET);

  const omzetQuery = `SELECT SUM(total_price) AS total_omzet FROM incomes WHERE purchase_date BETWEEN ? AND ?`;
  const userQuery = `SELECT email FROM users WHERE role IN ('admin', 'superadmin')`;

  db.query(omzetQuery, [startDate, endDate], (err, omzetResult) => {
    if (err) return console.error("Gagal cek omzet:", err);

    const totalOmzet = omzetResult[0].total_omzet || 0;
    if (totalOmzet >= target) {
      db.query(userQuery, async (err, userResult) => {
        if (err) return console.error("Gagal ambil email user:", err);

        const emails = userResult.map((u) => u.email);
        try {
          for (const email of emails) {
            await sendEmail({
              to: email,
              subject: `🎉 Omzet Bulan ${month}/${year} Tercapai!`,
              text: `Selamat! Omzet bulan ini telah mencapai Rp ${totalOmzet.toLocaleString()}.\nTarget: Rp ${target.toLocaleString()}`,
            });
          }
          console.log("Email omzet terkirim ke semua admin.");
        } catch (e) {
          console.error("Gagal kirim email:", e);
        }
      });
    } else {
      console.log(`Omzet bulan ${month}/${year} belum tercapai.`);
    }
  });
};

module.exports = runMonthlyOmzetCheck;
