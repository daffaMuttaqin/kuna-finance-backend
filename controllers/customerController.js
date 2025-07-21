// controllers/customerController.js
const Customer = require("../models/Customer");
const logActivity = require("../utils/logActivity");

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

    // Tambahkan aktivitas log
    logActivity(req.user.id, "CREATE", `Menambahkan Customer: ${name}`);

    res.status(201).json({ message: "Pelanggan berhasil ditambahkan" });
  });
};

exports.updateCustomer = (req, res) => {
  const { name, address, phone, instagram } = req.body;
  const customerId = req.params.id;

  // Ambil data lama terlebih dahulu
  Customer.getById(customerId, (err, oldData) => {
    if (err || !oldData) {
      return res.status(404).json({ message: "Pelanggan tidak ditemukan" });
    }

    // Data baru
    const newData = { name, address, phone, instagram };

    // Bandingkan dan catat perubahan
    let changes = [];
    for (let key in newData) {
      if (newData[key] !== undefined && newData[key] !== oldData[key]) {
        changes.push(`${key} dari "${oldData[key]}" menjadi "${newData[key]}"`);
      }
    }

    // Jalankan update
    Customer.update(customerId, newData, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Gagal mengubah data pelanggan" });
      }

      // Catat log hanya jika ada perubahan
      if (changes.length > 0) {
        const description = `Mengedit pelanggan: ${changes.join(", ")}`;
        logActivity(req.user.id, "UPDATE", description);
      }

      res.json({ message: "Data pelanggan berhasil diperbarui" });
    });
  });
};

exports.deleteCustomer = (req, res) => {
  const customerId = req.params.id;

  // Ambil dulu data customer sebelum dihapus
  Customer.getById(customerId, (err, customer) => {
    if (err || !customer) {
      return res.status(404).json({ message: "Pelanggan tidak ditemukan" });
    }

    // Hapus data setelah berhasil ambil
    Customer.delete(customerId, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Gagal menghapus pelanggan" });
      }

      // Catat log aktivitas
      logActivity(
        req.user.id,
        "DELETE",
        `Menghapus pelanggan: ${customer.name}`
      );

      res.json({ message: "Pelanggan berhasil dihapus" });
    });
  });
};
