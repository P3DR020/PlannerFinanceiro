const Transaction = require('../models/transaction');
const Budget = require('../models/budget');
const SavingsGoal = require('../models/SavingsGoal');

// @GET /api/dashboard/summary
exports.getSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Current month totals
    const [currentMonth, lastMonth, recentTransactions, savingsGoals] = await Promise.all([
      Transaction.aggregate([
        { $match: { user: userId, date: { $gte: startOfMonth } } },
        { $group: { _id: '$type', total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        { $match: { user: userId, date: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
        { $group: { _id: '$type', total: { $sum: '$amount' } } },
      ]),
      Transaction.find({ user: userId }).sort({ date: -1 }).limit(5),
      SavingsGoal.find({ user: userId, status: 'active' }).sort({ createdAt: -1 }).limit(4),
    ]);

    const formatTotals = (data) => {
      const result = { inflow: 0, outflow: 0 };
      data.forEach((d) => { result[d._id] = d.total; });
      return result;
    };

    const current = formatTotals(currentMonth);
    const last = formatTotals(lastMonth);
    const liquidity = current.inflow - current.outflow;
    const lastLiquidity = last.inflow - last.outflow;
    const liquidityChange = lastLiquidity > 0
      ? (((liquidity - lastLiquidity) / lastLiquidity) * 100).toFixed(1)
      : 0;

    // Spending by category this month
    const spendingByCategory = await Transaction.aggregate([
      { $match: { user: userId, type: 'outflow', date: { $gte: startOfMonth } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      success: true,
      data: {
        liquidity,
        liquidityChange: parseFloat(liquidityChange),
        currentMonth: current,
        lastMonth: last,
        recentTransactions,
        savingsGoals,
        spendingByCategory,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @GET /api/dashboard/cashflow
exports.getCashflow = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { months = 6 } = req.query;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));
    startDate.setDate(1);

    const cashflow = await Transaction.aggregate([
      { $match: { user: userId, date: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({ success: true, data: { cashflow } });
  } catch (err) {
    next(err);
  }
};