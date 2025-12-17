import express from "express";
import {
  fetchDailyStats,
  fetchWeeklyStats,
  fetchMonthlyStats,
  fetchYearlyStats,
} from "../controllers/appointmentTimeStats.js";

const router = express.Router();

router.get("/daily", fetchDailyStats);
router.get("/weekly", fetchWeeklyStats);
router.get("/monthly", fetchMonthlyStats);
router.get("/yearly", fetchYearlyStats);

export default router;
