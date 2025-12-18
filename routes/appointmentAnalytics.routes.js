import express from "express";
import { AppointmentAnalytics } from "../db/models/appointmentAnalytics.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { date, type } = req.query;

    if (!date || !type) {
      return res.status(400).json({
        message: "date and type are required",
      });
    }

    const analytics = await AppointmentAnalytics.findOne({ date, type });

    return res.json(analytics || { date, type, counts: {}, total: 0 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/daily-total", async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "date is required" });
    }

    const doc = await AppointmentAnalytics.findOne({
      date,
      type: "daily_total",
    });

    return res.json({
      date,
      total: doc?.total || 0,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/age-range", async (req, res) => {
  try {
    const { date, min = 0, max = 100 } = req.query;

    const doc = await AppointmentAnalytics.findOne({
      date,
      type: "age",
    });

    if (!doc) {
      return res.json({ count: 0 });
    }

    let count = 0;
    for (let age = Number(min); age <= Number(max); age++) {
      count += doc.counts.get(String(age)) || 0;
    }

    return res.json({
      date,
      range: `${min}-${max}`,
      count,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/today", async (req, res) => {
  try {
    /* ---------- Step 1: Get today's date (YYYY-MM-DD) ---------- */
    const today = new Date().toISOString().split("T")[0];

    /* ---------- Step 2: Fetch all analytics docs for today ---------- */
    const analyticsDocs = await AppointmentAnalytics.find({
      date: today,
    });

    /* ---------- Step 3: Prepare controlled response ---------- */
    const response = {
      date: today,
      daily_total: 0,
      gender: { counts: {}, total: 0 },
      age: { counts: {}, total: 0 },
      status: { counts: {}, total: 0 },
    };

    /* ---------- Step 4: Populate response ---------- */
    for (const doc of analyticsDocs) {
      if (doc.type === "daily_total") {
        response.daily_total = doc.total;
      } else {
        response[doc.type] = {
          counts: Object.fromEntries(doc.counts),
          total: doc.total,
        };
      }
    }

    /* ---------- Step 5: Send response ---------- */
    return res.status(200).json(response);
  } catch (error) {
    console.error("❌ Error fetching today's analytics:", error);
    return res.status(500).json({
      message: "Failed to fetch today's analytics",
    });
  }
});

router.get("/summary", async (req, res) => {
  try {
    /* ---------- Step 1: Fetch all analytics docs ---------- */
    const docs = await AppointmentAnalytics.find({});

    /* ---------- Step 2: Initialize accumulator ---------- */
    const summary = {
      totalAppointments: 0,
      gender: {},
      age: {},
      status: {},
    };

    /* ---------- Step 3: Merge all documents ---------- */
    for (const doc of docs) {
      // Add to global total (use daily_total docs only)
      if (doc.type === "daily_total") {
        summary.totalAppointments += doc.total;
        continue;
      }

      // Ensure section exists
      if (!summary[doc.type]) {
        summary[doc.type] = {};
      }

      // Merge counts
      for (const [key, value] of doc.counts.entries()) {
        summary[doc.type][key] = (summary[doc.type][key] || 0) + value;
      }
    }

    return res.status(200).json(summary);
  } catch (error) {
    console.error("❌ Error generating analytics summary:", error);
    return res.status(500).json({
      message: "Failed to generate analytics summary",
    });
  }
});

export default router;
