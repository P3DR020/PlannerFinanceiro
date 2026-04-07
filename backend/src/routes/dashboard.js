const express = require('express');
const router = express.Router();
const { getSummary, getCashflow } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
router.use(protect);
router.get('/summary', getSummary);
router.get('/cashflow', getCashflow);
module.exports = router;