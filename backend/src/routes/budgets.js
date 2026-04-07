// routes/budgets.js
const express = require('express');
const router = express.Router();
const { getBudgets, createBudget, updateBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');
router.use(protect);
router.route('/').get(getBudgets).post(createBudget);
router.route('/:id').patch(updateBudget);
module.exports = router;