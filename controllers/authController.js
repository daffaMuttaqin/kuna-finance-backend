// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.login = (req, res) => {
  const { email, password } = req.body;

  // console.log("Data Login:", email, password); //debug

  User.findByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (results.length === 0)
      return res.status(401).json({ message: "Email tidak ditemukan" });

    const user = results[0];

    // console.log("User Found:", user); // debug

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      return res.status(401).json({ message: "Password salah" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login berhasil",
      token,
      user: { id: user.id, name: user.name, role: user.role },
    });
  });
};

exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  // Validasi input
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Semua field harus diisi" });
  }

  // Cek apakah email sudah terdaftar
  User.findByEmail(email, async (err, users) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (users.length > 0)
      return res.status(400).json({ message: "Email sudah digunakan" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat akun Admin
    User.createAdmin(
      { name, email, password: hashedPassword },
      (err, result) => {
        if (err)
          return res.status(500).json({ message: "Gagal mendaftarkan admin" });
        res.status(201).json({ message: "Admin berhasil didaftarkan" });
      }
    );
  });
};
