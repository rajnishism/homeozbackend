import AppointmentTimeStats from "../db/models/appointmentTimeStatsSchema.js";

/* ================= ISO WEEK HELPERS ================= */

function getISOWeekYear(date) {
  const safeDate = new Date(date);
  const d = new Date(
    Date.UTC(safeDate.getFullYear(), safeDate.getMonth(), safeDate.getDate())
  );

  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);

  const isoYear = d.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const isoWeek = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);

  return { isoYear, isoWeek };
}

/* ================= UPDATE STATS ================= */

export async function updateAppointmentTimeStats(date, delta) {
  console.log("🔁 updateAppointmentTimeStats called");
  console.log("📅 Date:", date, "Delta:", delta);

  if (!date || !delta) {
    console.warn("⚠️ Invalid input for stats update");
    return;
  }

  const safeDate = new Date(date);
  const year = safeDate.getFullYear();
  const month = safeDate.getMonth() + 1;
  const day = safeDate.getDate();
  const { isoYear, isoWeek } = getISOWeekYear(safeDate);

  console.log("🧮 Buckets:", {
    day: { year, month, day },
    week: { isoYear, isoWeek },
    month: { year, month },
    year,
  });

  await Promise.all([
    AppointmentTimeStats.findOneAndUpdate(
      { type: "day", year, month, day },
      { $inc: { count: delta } },
      { upsert: true }
    ),
    AppointmentTimeStats.findOneAndUpdate(
      { type: "week", year: isoYear, week: isoWeek },
      { $inc: { count: delta } },
      { upsert: true }
    ),
    AppointmentTimeStats.findOneAndUpdate(
      { type: "month", year, month },
      { $inc: { count: delta } },
      { upsert: true }
    ),
    AppointmentTimeStats.findOneAndUpdate(
      { type: "year", year },
      { $inc: { count: delta } },
      { upsert: true }
    ),
  ]);

  console.log("✅ Time stats updated");
}

/* ================= FETCH STATS ================= */

export async function getDailyStats(year, month) {
  console.log("📊 Fetch daily stats:", year, month);
  return AppointmentTimeStats.find({
    type: "day",
    year,
    month,
  }).sort({ day: 1 });
}

export async function getWeeklyStats(year) {
  console.log("📊 Fetch weekly stats:", year);
  return AppointmentTimeStats.find({
    type: "week",
    year,
  }).sort({ week: 1 });
}

export async function getMonthlyStats(currentDate) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  return AppointmentTimeStats.find({
    type: "month",
    $or: [{ year, month: { $lt: month } }, { year: { $lt: year } }],
  }).sort({ year: 1, month: 1 });
}

export async function getYearlyStats() {
  return AppointmentTimeStats.find({
    type: "year",
  }).sort({ year: 1 });
}
