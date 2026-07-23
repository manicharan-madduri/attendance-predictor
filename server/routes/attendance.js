const express = require('express');
const {
  getAttendanceByMonth,
  upsertAttendance,
  deleteAttendance,
  getStats,
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/stats', getStats);
router.get('/', getAttendanceByMonth);
router.post('/', upsertAttendance);
router.delete('/:date', deleteAttendance);

module.exports = router;
