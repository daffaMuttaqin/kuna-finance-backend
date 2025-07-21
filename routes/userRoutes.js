const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken, isSuperAdmin } = require("../middleware/authMiddleware");

// Admin update profil sendiri
router.get("/profile", verifyToken, userController.getProfile);
router.put("/profile", verifyToken, userController.updateProfile);
router.put("/profile/password", verifyToken, userController.updatePassword);

// Super Admin kelola admin
router.get("/admins", verifyToken, isSuperAdmin, userController.getAllAdmins);
router.put(
  "/admins/:id",
  verifyToken,
  isSuperAdmin,
  userController.updateAdmin
);

module.exports = router;
