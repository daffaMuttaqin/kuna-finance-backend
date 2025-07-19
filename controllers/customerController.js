// controllers/customerController.js
const Customer = require("../models/Customer");

exports.getAllCustomers = (req, res) => {
  Customer.getAll((err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Gagal mengambil data pelanggan" });
    res.json(results);
  });
};

exports.getCustomerById = (req, res) => {
  Customer.getById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data" });
    if (result.length === 0)
      return res.status(404).json({ message: "Pelanggan tidak ditemukan" });
    res.json(result[0]);
  });
};

exports.createCustomer = (req, res) => {
  const { name, address, phone, instagram } = req.body;
  if (!name) return res.status(400).json({ message: "Nama wajib diisi" });

  Customer.create({ name, address, phone, instagram }, (err, result) => {
    if (err)
      return res.status(500).json({ message: "Gagal menambahkan pelanggan" });
    res.status(201).json({ message: "Pelanggan berhasil ditambahkan" });
  });
};

exports.updateCustomer = (req, res) => {
  const { name, address, phone, instagram } = req.body;

  Customer.update(
    req.params.id,
    { name, address, phone, instagram },
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Gagal mengubah data pelanggan" });
      res.json({ message: "Data pelanggan berhasil diperbarui" });
    }
  );
};

exports.deleteCustomer = (req, res) => {
  Customer.delete(req.params.id, (err, result) => {
    if (err)
      return res.status(500).json({ message: "Gagal menghapus pelanggan" });
    res.json({ message: "Pelanggan berhasil dihapus" });
  });
};
