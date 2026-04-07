const Transaction = require('../models/transaction');

// @GET /api/reports/trend-analysis
exports.getTrendAnalysis = async (req, res, next) => {
  try {
    const { months = 12 } = req.query;
    const userId = req.user._id;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));
    startDate.setDate(1);

    const trend = await Transaction.aggregate([
      { $match: { user: userId, date: { $gte: startDate } } },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' }, type: '$type' },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({ success: true, data: { trend } });
  } catch (err) {
    next(err);
  }
};

// @GET /api/reports/category-distribution
exports.getCategoryDistribution = async (req, res, next) => {
  try {
    const { startDate, endDate, sortBy = 'total' } = req.query;
    const userId = req.user._id;

    const match = { user: userId, type: 'outflow' };
    if (startDate || endDate) {
      match.date = {};
      if (startDate) match.date.$gte = new Date(startDate);
      if (endDate) match.date.$lte = new Date(endDate);
    }

    const distribution = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
        },
      },
      { $sort: { [sortBy]: -1 } },
    ]);

    res.json({ success: true, data: { distribution } });
  } catch (err) {
    next(err);
  }
};

// @GET /api/reports/spending-patterns
exports.getSpendingPatterns = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90);

    const patterns = await Transaction.aggregate([
      { $match: { user: userId, type: 'outflow', date: { $gte: startDate } } },
      {
        $group: {
          _id: { dayOfWeek: { $dayOfWeek: '$date' }, week: { $week: '$date' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.week': 1, '_id.dayOfWeek': 1 } },
    ]);

    res.json({ success: true, data: { patterns } });
  } catch (err) {
    next(err);
  }
};

// @GET /api/reports/period-comparison
exports.getPeriodComparison = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const currentStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const priorStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const priorEnd = new Date(now.getFullYear(), now.getMonth() - 6, 0);

    const [current, prior] = await Promise.all([
      Transaction.aggregate([
        { $match: { user: userId, date: { $gte: currentStart } } },
        { $group: { _id: '$type', total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        { $match: { user: userId, date: { $gte: priorStart, $lte: priorEnd } } },
        { $group: { _id: '$type', total: { $sum: '$amount' } } },
      ]),
    ]);

    const fmt = (data) => {
      const r = { inflow: 0, outflow: 0 };
      data.forEach((d) => { r[d._id] = d.total; });
      return r;
    };

    const c = fmt(current);
    const p = fmt(prior);

    const liquidityRatio = c.inflow > 0 ? ((c.inflow - c.outflow) / c.inflow * 100).toFixed(1) : 0;
    const priorLiquidityRatio = p.inflow > 0 ? ((p.inflow - p.outflow) / p.inflow * 100).toFixed(1) : 0;
    const debtUtilization = c.outflow > 0 ? (c.outflow / c.inflow * 100).toFixed(1) : 0;
    const priorDebtUtilization = p.outflow > 0 ? (p.outflow / p.inflow * 100).toFixed(1) : 0;

    const efficiencyScore = Math.min(Math.round(parseFloat(liquidityRatio) + 50), 100);

    res.json({
      success: true,
      data: {
        current: c, prior: p,
        metrics: {
          liquidityRatio: parseFloat(liquidityRatio),
          liquidityChange: parseFloat((liquidityRatio - priorLiquidityRatio).toFixed(1)),
          debtUtilization: parseFloat(debtUtilization),
          debtUtilizationChange: parseFloat((debtUtilization - priorDebtUtilization).toFixed(1)),
          efficiencyScore,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};