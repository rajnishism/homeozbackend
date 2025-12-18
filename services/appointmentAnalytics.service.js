import { AppointmentAnalytics } from "../db/models/appointmentAnalytics.model.js";

// Returns today's date like "2025-12-18"
const getTodayDateString = () => new Date().toISOString().split("T")[0];

/**
 * Generic function to update analytics
 * Works for ANY type: age, gender, status, daily_total
 */
export const incrementAnalytics = async ({
  type, // analytics type (age / gender / status / daily_total)
  key, // specific key (male / 32 / pending)
  delta = 1, // +1 or -1
}) => {
  const date = getTodayDateString();

  // Build increment object dynamically
  const incObj = {
    total: delta, // always update total
  };

  // Only update counts if key is provided
  if (key !== undefined) {
    incObj[`counts.${key}`] = delta;
  }

  // Atomic update (safe for parallel requests)
  await AppointmentAnalytics.findOneAndUpdate(
    { date, type },
    { $inc: incObj },
    { upsert: true }
  );
};
