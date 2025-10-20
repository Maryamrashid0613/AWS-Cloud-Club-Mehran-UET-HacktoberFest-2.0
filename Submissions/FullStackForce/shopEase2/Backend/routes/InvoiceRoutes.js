import express from "express";
import { acceptInvoice, createInvoice, deleteInvoice, getInvoices } from "../controllers/InvoiceController.js";


const router = express.Router();

router.post("/", createInvoice);
router.get("/", getInvoices);
router.put("/accept/:id", acceptInvoice);
router.delete("/:id", deleteInvoice);

export default router;
