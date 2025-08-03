// controllers/incomeController.js
const Income = require("../models/Income");
const logActivity = require("../utils/logActivity");

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

    // Tambahkan aktivitas log
    logActivity(
      req.user.id,
      "CREATE",
      `Menambahkan pemasukan: ${item_name} (Rp${total_price})`
    );

    res.status(201).json({ message: "Pemasukan berhasil ditambahkan" });
  });
};

exports.updateIncome = (req, res) => {
  const { id } = req.params;
  const { item_name, customer_id, purchase_date, total_price, notes } =
    req.body;

  const newData = { item_name, customer_id, purchase_date, total_price, notes };

  // Ambil data income lama
  Income.getById(id, (err, oldData) => {
    if (err || !oldData) {
      return res
        .status(404)
        .json({ message: "Data pemasukan tidak ditemukan" });
    }

    // Bandingkan perubahan
    const changes = [];
    for (let key in newData) {
      if (newData[key] !== undefined && newData[key] != oldData[key]) {
        changes.push(`${key} dari "${oldData[key]}" menjadi "${newData[key]}"`);
      }
    }

    // Update data
    Income.update(id, newData, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Gagal memperbarui data" });
      }

      // Catat aktivitas jika ada perubahan
      if (changes.length > 0) {
        const description = `Mengedit pemasukan: ${changes.join(", ")}`;
        logActivity(req.user.id, "UPDATE", description);
      }

      res.json({ message: "Pemasukan berhasil diupdate" });
    });
  });
};

exports.deleteIncome = (req, res) => {
  const { id } = req.params;

  // Ambil data pemasukan sebelum dihapus
  Income.getById(id, (err, income) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Gagal mengambil data pemasukan" });
    if (!income)
      return res
        .status(404)
        .json({ message: "Data pemasukan tidak ditemukan" });

    // Simpan informasi sebelum dihapus
    const { item_name, total_price } = income;

    // Lanjutkan proses hapus
    Income.delete(id, (err2, result) => {
      if (err2)
        return res.status(500).json({ message: "Gagal menghapus data" });

      // Tambahkan log aktivitas
      logActivity(
        req.user.id,
        "DELETE",
        `Menghapus data pemasukan: ${item_name} (Rp${total_price})`
      );

      res.json({ message: "Pemasukan berhasil dihapus" });
    });
  });
};
