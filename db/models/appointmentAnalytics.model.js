import mongoose from "mongoose";

const appointmentAnalyticsSchema = new mongoose.Schema(
  {
    // Date for which analytics are stored (YYYY-MM-DD)
    date: {
      type: String,
      required: true,
      index: true,
    },

    // Type of analytics (age, gender, status, daily_total, city, etc.)
    type: {
      type: String,
      required: true,
      index: true,
    },

    // Dynamic key-value map
    // ex: { "male": 10, "female": 12 }
    // ex: { "32": 4, "34": 2 }
    counts: {
      type: Map,
      of: Number,
      default: {},
    },

    // Total count for this type on that date
    total: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Only ONE document allowed per (date + type)
appointmentAnalyticsSchema.index({ date: 1, type: 1 }, { unique: true });

export const AppointmentAnalytics = mongoose.model(
  "AppointmentAnalytics",
  appointmentAnalyticsSchema
);
export default AppointmentAnalytics;
