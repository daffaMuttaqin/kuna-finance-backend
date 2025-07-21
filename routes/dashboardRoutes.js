// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const {
  verifyToken,
  isAdminOrSuperAdmin,
} = require("../middleware/authMiddleware");

router.get("/", verifyToken, dashboardController.getDashboardSummary);
router.get(
  "/omzet-status",
  verifyToken,
  isAdminOrSuperAdmin,
  dashboardController.getOmzetStatus
);

module.exports = router;
