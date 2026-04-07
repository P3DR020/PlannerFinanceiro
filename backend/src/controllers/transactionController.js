const Transaction = require('../models/transaction');

// @GET /api/transactions
exports.getTransactions = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 25, category, type,
      startDate, endDate, paymentMethod, search,
      sortBy = 'date', sortOrder = 'desc'
    } = req.query;

    const filter = { user: req.user._id };
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { merchant: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [transactions, total] = await Promise.all([
      Transaction.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
      Transaction.countDocuments(filter),
    ]);

    // Summary totals
    const summary = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const totals = { inflow: 0, outflow: 0 };
    summary.forEach((s) => { totals[s._id] = s.total; });

    res.json({
      success: true,
      data: { transactions, totals },
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

// @POST /api/transactions
exports.createTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: { transaction } });
  } catch (err) {
    next(err);
  }
};

// @GET /api/transactions/:id
exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
    res.json({ success: true, data: { transaction } });
  } catch (err) {
    next(err);
  }
};

// @PATCH /api/transactions/:id
exports.updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
    res.json({ success: true, data: { transaction } });
  } catch (err) {
    next(err);
  }
};

// @DELETE /api/transactions/:id
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
    res.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (err) {
    next(err);
  }
};