const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.getProfile = (req, res) => {
  User.getById(req.user.id, (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil profil" });
    res.json(result[0]);
  });
};

exports.updateProfile = (req, res) => {
  const { name, email } = req.body;
  User.updateSelf(req.user.id, { name, email }, (err) => {
    if (err) return res.status(500).json({ message: "Gagal update profil" });
    res.json({ message: "Profil berhasil diperbarui" });
  });
};

exports.updatePassword = async (req, res) => {
  const { password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  User.updatePassword(req.user.id, hashed, (err) => {
    if (err) return res.status(500).json({ message: "Gagal update password" });
    res.json({ message: "Password berhasil diubah" });
  });
};

// SUPER ADMIN
exports.getAllAdmins = (req, res) => {
  User.getAllAdmins((err, results) => {
    if (err) return res.status(500).json({ message: "Gagal ambil admin" });
    res.json(results);
  });
};

exports.updateAdmin = (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  User.updateAdminById(id, { name, email }, (err) => {
    if (err) return res.status(500).json({ message: "Gagal update admin" });
    res.json({ message: "Data admin berhasil diupdate" });
  });
};
