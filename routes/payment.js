import { v4 as uuidv4 } from "uuid";
uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
import express from "express";
const router = express.Router();

import {
    createOrder,
    verifyPayment,
    getAllPayments,
    deleteAllPayments,
    getUserPayment
} from "../controllers/paymentController.js";
router.post("/create-order", createOrder);
router.post("/verify-payment/:id", verifyPayment);
router.get("/get-payments", getAllPayments);
router.post("/user-payments", getUserPayment);
router.delete("/delete-payments", deleteAllPayments);

export default router;
