// routes/incomeRoutes.js
const express = require("express");
const router = express.Router();
const incomeController = require("../controllers/incomeController");
const { verifyToken } = require("../middleware/authMiddleware");

// Semua butuh login
router.get("/", verifyToken, incomeController.getIncomes);
router.post("/", verifyToken, incomeController.createIncome);
router.put("/:id", verifyToken, incomeController.updateIncome);
router.delete("/:id", verifyToken, incomeController.deleteIncome);

module.exports = router;
