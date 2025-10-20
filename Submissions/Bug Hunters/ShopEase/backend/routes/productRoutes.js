import express from "express";
import { addProduct, getProducts, updateProduct, deleteProduct } from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getProducts)
  .post(protect, adminOnly, addProduct);

router.route("/:id")
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

export default router;
