// controllers/incomeController.js
const Income = require("../models/Income");

exports.getIncomes = (req, res) => {
  Income.getAll((err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data" });
    res.json(results);
  });
};

exports.createIncome = (req, res) => {
  const { item_name, customer_id, purchase_date, total_price, notes } =
    req.body;

  if (!item_name || !purchase_date || !total_price) {
    return res.status(400).json({ message: "Field wajib tidak boleh kosong" });
  }

  const data = {
    item_name,
    customer_id,
    purchase_date,
    total_price,
    notes,
    created_by: req.user.id,
  };

  Income.create(data, (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal menambah data" });
    res.status(201).json({ message: "Pemasukan berhasil ditambahkan" });
  });
};

exports.updateIncome = (req, res) => {
  const { id } = req.params;
  const { item_name, customer_id, purchase_date, total_price, notes } =
    req.body;

  const data = { item_name, customer_id, purchase_date, total_price, notes };

  Income.update(id, data, (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal memperbarui data" });
    res.json({ message: "Pemasukan berhasil diupdate" });
  });
};

exports.deleteIncome = (req, res) => {
  const { id } = req.params;
  Income.delete(id, (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal menghapus data" });
    res.json({ message: "Pemasukan berhasil dihapus" });
  });
};
