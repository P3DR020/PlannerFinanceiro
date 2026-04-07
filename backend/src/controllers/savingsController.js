const SavingsGoal = require('../models/SavingsGoal');

// @GET /api/savings
exports.getSavingsGoals = async (req, res, next) => {
  try {
    const goals = await SavingsGoal.find({ user: req.user._id }).sort({ createdAt: -1 });
    const totalPortfolio = goals.reduce((sum, g) => sum + g.savedAmount, 0);
    res.json({ success: true, data: { goals, totalPortfolio } });
  } catch (err) {
    next(err);
  }
};

// @POST /api/savings
exports.createGoal = async (req, res, next) => {
  try {
    const goal = await SavingsGoal.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: { goal } });
  } catch (err) {
    next(err);
  }
};

// @POST /api/savings/:id/contribute
exports.addContribution = async (req, res, next) => {
  try {
    const { amount, note, type } = req.body;
    const goal = await SavingsGoal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });

    goal.contributions.push({ amount, note, type });
    goal.savedAmount += amount;

    if (goal.savedAmount >= goal.targetAmount) {
      goal.status = 'completed';
    }

    await goal.save();
    res.json({ success: true, data: { goal } });
  } catch (err) {
    next(err);
  }
};

// @PATCH /api/savings/:id
exports.updateGoal = async (req, res, next) => {
  try {
    const goal = await SavingsGoal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });
    res.json({ success: true, data: { goal } });
  } catch (err) {
    next(err);
  }
};

// @DELETE /api/savings/:id
exports.deleteGoal = async (req, res, next) => {
  try {
    await SavingsGoal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Goal deleted' });
  } catch (err) {
    next(err);
  }
};