// controllers/expenseController.js
const Expense = require("../models/Expense");

exports.getAllExpenses = (req, res) => {
  Expense.getAll((err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Gagal mengambil data pengeluaran" });
    res.json(results);
  });
};

exports.getExpenseById = (req, res) => {
  Expense.getById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data" });
    if (result.length === 0)
      return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json(result[0]);
  });
};

exports.createExpense = (req, res) => {
  const { item_name, expense_date, total_price, notes } = req.body;
  if (!item_name || !expense_date || !total_price)
    return res.status(400).json({ message: "Data wajib diisi lengkap" });

  const data = {
    item_name,
    expense_date,
    total_price,
    notes,
    created_by: req.user.id,
  };

  Expense.create(data, (err, result) => {
    if (err)
      return res.status(500).json({ message: "Gagal menambahkan pengeluaran" });
    res.status(201).json({ message: "Pengeluaran berhasil ditambahkan" });
  });
};

exports.updateExpense = (req, res) => {
  const { item_name, expense_date, total_price, notes } = req.body;

  Expense.update(
    req.params.id,
    { item_name, expense_date, total_price, notes },
    (err) => {
      if (err)
        return res.status(500).json({ message: "Gagal mengubah pengeluaran" });
      res.json({ message: "Pengeluaran berhasil diperbarui" });
    }
  );
};

exports.deleteExpense = (req, res) => {
  Expense.delete(req.params.id, (err) => {
    if (err)
      return res.status(500).json({ message: "Gagal menghapus pengeluaran" });
    res.json({ message: "Pengeluaran berhasil dihapus" });
  });
};
