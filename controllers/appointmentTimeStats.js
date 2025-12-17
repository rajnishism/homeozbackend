import {
  getDailyStats,
  getWeeklyStats,
  getMonthlyStats,
  getYearlyStats,
} from "../services/appointmentTimeStats.service.js";

export const fetchDailyStats = async (req, res) => {
  const now = new Date();

  const year = req.query.year ? Number(req.query.year) : now.getFullYear();

  const month = req.query.month ? Number(req.query.month) : now.getMonth() + 1;

  const data = await getDailyStats(year, month);
  res.json(data);
};

export const fetchWeeklyStats = async (req, res) => {
  const year = req.query.year
    ? Number(req.query.year)
    : new Date().getFullYear();

  const data = await getWeeklyStats(year);
  res.json(data);
};

export const fetchMonthlyStats = async (_req, res) => {
  const data = await getMonthlyStats(new Date());
  res.json(data);
};

export const fetchYearlyStats = async (_req, res) => {
  const data = await getYearlyStats();
  res.json(data);
};
