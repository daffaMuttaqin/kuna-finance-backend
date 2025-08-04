// controllers/expenseController.js
const Expense = require("../models/Expense");
const logActivity = require("../utils/logActivity");

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
  const { item_name, category, expense_date, total_price, notes } = req.body;
  if (!item_name || !category || !expense_date || !total_price)
    return res.status(400).json({ message: "Data wajib diisi lengkap" });

  const data = {
    item_name,
    category,
    expense_date,
    total_price,
    notes,
    created_by: req.user.id,
  };

  Expense.create(data, (err, result) => {
    if (err)
      return res.status(500).json({ message: "Gagal menambahkan pengeluaran" });

    // Tambahkan aktivitas log
    logActivity(
      req.user.id,
      "CREATE",
      `Menambahkan pengeluaran: ${item_name} (Rp${total_price})`
    );

    res.status(201).json({ message: "Pengeluaran berhasil ditambahkan" });
  });
};

exports.updateExpense = (req, res) => {
  const { id } = req.params;
  const { item_name, category, expense_date, total_price, notes } = req.body;

  const newData = { item_name, category, expense_date, total_price, notes };

  // Ambil data expenses yang lama
  Expense.getById(id, (err, oldData) => {
    if (err || !oldData) {
      return res
        .status(404)
        .json({ message: "Data pengeluaran tidak ditemukan" });
    }
    // Buat perbandingan perubahan
    const changes = [];
    for (let key in newData) {
      if (newData[key] !== undefined && newData[key] != oldData[key]) {
        changes.push(`${key} dari "${oldData[key]}" menjadi "${newData[key]}"`);
      }
    }

    // Update data
    Expense.update(id, newData, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Gagal memperbarui data" });
      }

      // Catat aktivitas jika ada perubahan
      if (changes.length > 0) {
        const description = `Mengedit pengeluaran: ${changes.join(", ")}`;
        logActivity(req.user.id, "UPDATE", description);
      }

      res.json({ message: "Pengeluaran berhasil diupdate" });
    });
  });
};

exports.deleteExpense = (req, res) => {
  const { id } = req.params;

  // Ambil data pemasukan sebelum dihapus
  Expense.getById(id, (err, expense) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Gagal mengambil data pengeluaran" });
    if (!expense)
      return res
        .status(404)
        .json({ message: "Data pemasukan tidak ditemukan" });

    // Simpan informasi sebelum dihapus
    const { item_name, total_price } = expense;

    // Lanjutkan proses hapus
    Expense.delete(id, (err2, result) => {
      if (err2)
        return res.status(500).json({ message: "Gagal menghapus data" });

      // Tambahkan aktivitas log
      logActivity(
        req.user.id,
        "DELETE",
        `Menghapus data pengeluaran: ${item_name} (Rp${total_price})`
      );
      res.json({ message: "Pmeasukan berhasil dihapus" });
    });
  });
};

exports.getMonthlyCategorySummary = (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res
      .status(400)
      .json({ message: "Parameter bulan dan tahun wajib diisi" });
  }

  Expense.getMonthlySummaryByCategory(
    parseInt(month),
    parseInt(year),
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Gagal mengambil ringkasan pengeluaran" });
      }

      res.json(results);
    }
  );
};
