// routes/customerRoutes.js
const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const { verifyToken } = require("../middleware/authMiddleware");

// Semua hanya bisa diakses oleh Admin & Super Admin
router.get("/", verifyToken, customerController.getAllCustomers);
router.get("/:id", verifyToken, customerController.getCustomerById);
router.post("/", verifyToken, customerController.createCustomer);
router.put("/:id", verifyToken, customerController.updateCustomer);
router.delete("/:id", verifyToken, customerController.deleteCustomer);

module.exports = router;
