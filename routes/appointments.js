import { v4 as uuidv4 } from "uuid";
uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
import express from "express";
const router = express.Router();

import {
  getAppointement,
  createAppointment,
  getAppointements,
  deleteAppointment,
  updateAppointment,
  getPaidAppointments,
} from "../controllers/appointments.js";

router.get("/", getAppointements);
router.get("/:id", getAppointement);
router.post("/", createAppointment);
router.patch("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

export default router;
