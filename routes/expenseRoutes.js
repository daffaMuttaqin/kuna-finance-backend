// routes/expenseRoutes.js
const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const { verifyToken } = require("../middleware/authMiddleware");

// Semua hanya bisa diakses oleh Admin/SuperAdmin
router.get("/", verifyToken, expenseController.getAllExpenses);
router.get("/:id", verifyToken, expenseController.getExpenseById);
router.post("/", verifyToken, expenseController.createExpense);
router.put("/:id", verifyToken, expenseController.updateExpense);
router.delete("/:id", verifyToken, expenseController.deleteExpense);
router.get(
  "/summary/category",
  verifyToken,
  expenseController.getMonthlyCategorySummary
);

module.exports = router;
