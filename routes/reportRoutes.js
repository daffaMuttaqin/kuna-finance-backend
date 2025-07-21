// routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, reportController.getReport);
router.get("/export", verifyToken, reportController.exportReport);

module.exports = router;
