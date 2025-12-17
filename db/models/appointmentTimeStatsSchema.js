import mongoose from "mongoose";

const appointmentTimeStatsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["day", "week", "month", "year"],
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    month: Number, // for day & month
    week: Number, // ISO week
    day: Number, // day of month

    count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

appointmentTimeStatsSchema.index(
  { type: 1, year: 1, month: 1, week: 1, day: 1 },
  { unique: true }
);

export default mongoose.model(
  "AppointmentTimeStats",
  appointmentTimeStatsSchema
);
