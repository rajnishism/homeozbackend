import { incrementAnalytics } from "./appointmentAnalytics.service.js";

/**
 * Update analytics AFTER successful payment
 * This function represents ONE confirmed appointment
 */
export const updateAnalyticsOnSuccessfulPayment = async (appointment) => {
  if (!appointment) return;

  const { age, gender } = appointment.personal;

  /* ---------- Daily total ---------- */
  await incrementAnalytics({
    type: "daily_total",
  });

  /* ---------- Appointment status ---------- */
  await incrementAnalytics({
    type: "status",
    key: "paid",
  });

  /* ---------- Gender analytics ---------- */
  if (gender) {
    await incrementAnalytics({
      type: "gender",
      key: gender.toLowerCase(),
    });
  }

  /* ---------- Age analytics ---------- */
  if (age !== undefined) {
    await incrementAnalytics({
      type: "age",
      key: String(age),
    });
  }
};
