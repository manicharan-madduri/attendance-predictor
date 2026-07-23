const Attendance = require('../models/Attendance');

// Build default 7 periods
const defaultPeriods = () =>
  Array.from({ length: 7 }, (_, i) => ({
    periodNumber: i + 1,
    conducted: true,
    attended: false,
  }));

// @route GET /api/attendance?month=YYYY-MM
const getAttendanceByMonth = async (req, res) => {
  try {
    const { month } = req.query; // e.g. "2024-07"
    const query = { userId: req.user._id };
    if (month) query.date = { $regex: `^${month}` };

    const records = await Attendance.find(query).sort({ date: 1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/attendance  — upsert a day's record
const upsertAttendance = async (req, res) => {
  try {
    const { date, isHoliday, holidayReason, periods } = req.body;
    if (!date) return res.status(400).json({ message: 'Date is required' });

    const record = await Attendance.findOneAndUpdate(
      { userId: req.user._id, date },
      {
        userId: req.user._id,
        date,
        isHoliday: isHoliday ?? false,
        holidayReason: holidayReason ?? '',
        periods: periods ?? defaultPeriods(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/attendance/:date
const deleteAttendance = async (req, res) => {
  try {
    await Attendance.findOneAndDelete({ userId: req.user._id, date: req.params.date });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/attendance/stats
const getStats = async (req, res) => {
  try {
    const records = await Attendance.find({ userId: req.user._id });

    let totalConducted = 0;
    let totalAttended = 0;
    let holidays = 0;
    let workingDays = 0;

    const monthlyMap = {};

    records.forEach((rec) => {
      if (rec.isHoliday) { holidays++; return; }
      workingDays++;
      const month = rec.date.slice(0, 7);
      if (!monthlyMap[month]) monthlyMap[month] = { conducted: 0, attended: 0 };

      rec.periods.forEach((p) => {
        if (p.conducted) {
          totalConducted++;
          monthlyMap[month].conducted++;
          if (p.attended) {
            totalAttended++;
            monthlyMap[month].attended++;
          }
        }
      });
    });

    const percentage = totalConducted
      ? ((totalAttended / totalConducted) * 100).toFixed(2)
      : 0;

    const monthly = Object.entries(monthlyMap).map(([month, data]) => ({
      month,
      conducted: data.conducted,
      attended: data.attended,
      percentage: data.conducted
        ? ((data.attended / data.conducted) * 100).toFixed(2)
        : 0,
    }));

    const best = monthly.reduce((a, b) => (+a.percentage > +b.percentage ? a : b), monthly[0] || {});
    const worst = monthly.reduce((a, b) => (+a.percentage < +b.percentage ? a : b), monthly[0] || {});

    res.json({
      totalConducted,
      totalAttended,
      totalMissed: totalConducted - totalAttended,
      percentage,
      holidays,
      workingDays,
      monthly,
      bestMonth: best?.month || null,
      worstMonth: worst?.month || null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAttendanceByMonth, upsertAttendance, deleteAttendance, getStats };
