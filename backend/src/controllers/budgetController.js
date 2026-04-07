const Budget = require('../models/budget');
const Transaction = require('../models/transaction');

// @GET /api/budgets — get current month budget
exports.getBudgets = async (req, res, next) => {
  try {
    const now = new Date();
    const { month = now.getMonth() + 1, year = now.getFullYear() } = req.query;

    let budget = await Budget.findOne({ user: req.user._id, month: parseInt(month), year: parseInt(year) });

    if (budget) {
      // Sync spent amounts from transactions
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);

      const spent = await Transaction.aggregate([
        { $match: { user: req.user._id, type: 'outflow', date: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
      ]);

      const spentMap = {};
      spent.forEach((s) => { spentMap[s._id] = s.total; });

      budget.categories.forEach((cat) => { cat.spent = spentMap[cat.category] || 0; });
      await budget.save();
    }

    res.json({ success: true, data: { budget } });
  } catch (err) {
    next(err);
  }
};

// @POST /api/budgets
exports.createBudget = async (req, res, next) => {
  try {
    const budget = await Budget.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: { budget } });
  } catch (err) {
    next(err);
  }
};

// @PATCH /api/budgets/:id
exports.updateBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!budget) return res.status(404).json({ success: false, message: 'Budget not found' });
    res.json({ success: true, data: { budget } });
  } catch (err) {
    next(err);
  }
};