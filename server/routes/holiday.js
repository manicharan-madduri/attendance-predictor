const express = require('express');
const Attendance = require('../models/Attendance');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// Mark a date as holiday
router.post('/', async (req, res) => {
  try {
    const { date, reason } = req.body;
    if (!date) return res.status(400).json({ message: 'Date required' });
    const record = await Attendance.findOneAndUpdate(
      { userId: req.user._id, date },
      { userId: req.user._id, date, isHoliday: true, holidayReason: reason || '', periods: [] },
      { upsert: true, new: true }
    );
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove holiday from a date
router.delete('/:date', async (req, res) => {
  try {
    await Attendance.findOneAndDelete({ userId: req.user._id, date: req.params.date, isHoliday: true });
    res.json({ message: 'Holiday removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
