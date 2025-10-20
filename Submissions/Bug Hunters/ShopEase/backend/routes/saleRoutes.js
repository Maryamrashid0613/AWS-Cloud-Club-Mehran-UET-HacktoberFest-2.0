import express from "express";
import { createSale, getSales, getReport, exportSalesCSV } from "../controllers/saleController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getSales)
  .post(protect, createSale);

router.get("/report", protect, getReport);
router.get("/export/csv", protect, exportSalesCSV);

export default router;