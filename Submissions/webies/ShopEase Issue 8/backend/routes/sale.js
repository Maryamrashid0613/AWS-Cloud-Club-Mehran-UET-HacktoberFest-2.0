const express = require("express");
const {
  createSale,
  getAllSales,
  getSaleById,
  deleteSale,
} = require("../controllers/handleSales");

const router = express.Router();

router.post("/", createSale);
router.get("/", getAllSales);
router.get("/:id", getSaleById);
router.delete("/:id", deleteSale);

module.exports = router;
