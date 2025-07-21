// controllers/reportController.js
const db = require("../config/db");
const ExcelJS = require("exceljs");

exports.getReport = (req, res) => {
  const { start, end } = req.query;

  const incomeQuery = `SELECT * FROM incomes WHERE purchase_date BETWEEN ? AND ?`;
  const expenseQuery = `SELECT * FROM expenses WHERE expense_date BETWEEN ? AND ?`;

  const data = {};

  db.query(incomeQuery, [start, end], (err, incomeRows) => {
    if (err) return res.status(500).json({ message: "Error fetching incomes" });

    data.incomes = incomeRows;

    db.query(expenseQuery, [start, end], (err, expenseRows) => {
      if (err)
        return res.status(500).json({ message: "Error fetching expenses" });

      data.expenses = expenseRows;

      res.json(data);
    });
  });
};

exports.exportReport = (req, res) => {
  const { start, end } = req.query;

  const incomeQuery = `SELECT * FROM incomes WHERE purchase_date BETWEEN ? AND ?`;
  const expenseQuery = `SELECT * FROM expenses WHERE expense_date BETWEEN ? AND ?`;

  const workbook = new ExcelJS.Workbook();
  const incomeSheet = workbook.addWorksheet("Incomes");
  const expenseSheet = workbook.addWorksheet("Expenses");

  // Header untuk incomes
  incomeSheet.columns = [
    { header: "ID", key: "id", width: 5 },
    { header: "Nama Barang", key: "item_name", width: 25 },
    { header: "Nama Pelanggan", key: "customer_name", width: 25 },
    { header: "Tanggal", key: "purchase_date", width: 15 },
    { header: "Total Harga", key: "total_price", width: 15 },
    { header: "Keterangan", key: "description", width: 30 },
  ];

  // Header untuk expenses
  expenseSheet.columns = [
    { header: "ID", key: "id", width: 5 },
    { header: "Nama Barang", key: "item_name", width: 25 },
    { header: "Tanggal", key: "expense_date", width: 15 },
    { header: "Total Harga", key: "total_price", width: 15 },
    { header: "Keterangan", key: "description", width: 30 },
  ];

  // Ambil data dari database
  db.query(incomeQuery, [start, end], (err, incomeRows) => {
    if (err)
      return res.status(500).json({ message: "Error exporting incomes" });

    incomeSheet.addRows(incomeRows);

    db.query(expenseQuery, [start, end], async (err, expenseRows) => {
      if (err)
        return res.status(500).json({ message: "Error exporting expenses" });

      expenseSheet.addRows(expenseRows);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=Laporan-Keuangan-${start}_to_${end}.xlsx`
      );

      await workbook.xlsx.write(res);
      res.end();
    });
  });
};
