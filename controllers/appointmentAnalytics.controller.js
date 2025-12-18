import { Appointement } from "../models/appointmentSchema.js";
import { incrementAnalytics } from "../services/appointmentAnalytics.service.js";

export const createAppointment = async (req, res) => {
  try {
    // 1️⃣ Save appointment (raw data)
    const appointment = await Appointement.create(req.body);

    const { age, gender } = appointment.personal;

    // 2️⃣ Daily total (increment ONCE)
    await incrementAnalytics({
      type: "daily_total",
    });

    // 3️⃣ Gender analytics
    if (gender) {
      await incrementAnalytics({
        type: "gender",
        key: gender.toLowerCase(),
      });
    }

    // 4️⃣ Age analytics
    if (age !== undefined) {
      await incrementAnalytics({
        type: "age",
        key: String(age),
      });
    }

    // 5️⃣ Status analytics (initial status = pending)
    await incrementAnalytics({
      type: "status",
      key: appointment.status,
    });

    res.status(201).json({
      success: true,
      appointment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
