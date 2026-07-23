const mongoose = require('mongoose');

const periodSchema = new mongoose.Schema({
  periodNumber: { type: Number, required: true, min: 1, max: 7 },
  conducted: { type: Boolean, default: true },
  attended: { type: Boolean, default: false },
});

const attendanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // stored as YYYY-MM-DD
    isHoliday: { type: Boolean, default: false },
    holidayReason: { type: String, default: '' },
    periods: [periodSchema],
  },
  { timestamps: true }
);

// Compound unique index: one record per user per date
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
