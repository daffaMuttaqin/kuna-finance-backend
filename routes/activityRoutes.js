const express = require("express");
const router = express.Router();
const { getActivityLogs } = require("../controllers/activityController");
const {
  verifyToken,
  isAdminOrSuperAdmin,
} = require("../middleware/authMiddleware");

router.get("/", verifyToken, isAdminOrSuperAdmin, getActivityLogs);

module.exports = router;
