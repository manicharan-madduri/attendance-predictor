const express = require('express');
const { predict, simulate } = require('../controllers/predictionController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.post('/', predict);
router.post('/simulate', simulate);

module.exports = router;
