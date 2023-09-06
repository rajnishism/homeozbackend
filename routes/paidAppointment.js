import { v4 as uuidv4 } from "uuid";
uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
import express from "express";
const router = express.Router();

import { getPaidAppointments } from "../controllers/appointments.js";

router.get("/", getPaidAppointments);
