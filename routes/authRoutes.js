// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken, isSuperAdmin } = require("../middleware/authMiddleware");

router.post("/login", authController.login);

// Hanya Super Admin yang bisa daftar Admin baru
router.post(
  "/register",
  verifyToken,
  isSuperAdmin,
  authController.registerAdmin
);

module.exports = router;
