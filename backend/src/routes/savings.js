const express = require('express');
const router = express.Router();
const { getSavingsGoals, createGoal, addContribution, updateGoal, deleteGoal } = require('../controllers/savingsController');
const { protect } = require('../middleware/auth');
router.use(protect);
router.route('/').get(getSavingsGoals).post(createGoal);
router.route('/:id').patch(updateGoal).delete(deleteGoal);
router.post('/:id/contribute', addContribution);
module.exports = router;