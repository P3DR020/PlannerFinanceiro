const mongoose = require('mongoose');

const budgetCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  limit: { type: Number, required: true },
  spent: { type: Number, default: 0 },
  icon: { type: String, default: '💼' },
  color: { type: String, default: '#0040a1' },
});

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  month: {
    type: Number,
    required: true, // 1-12
  },
  year: {
    type: Number,
    required: true,
  },
  totalBudget: {
    type: Number,
    required: true,
  },
  categories: [budgetCategorySchema],
  notes: String,
}, { timestamps: true });

budgetSchema.index({ user: 1, year: -1, month: -1 });
budgetSchema.index({ user: 1, year: 1, month: 1 }, { unique: true });

// Virtual: total spent
budgetSchema.virtual('totalSpent').get(function () {
  return this.categories.reduce((sum, cat) => sum + (cat.spent || 0), 0);
});

// Virtual: remaining
budgetSchema.virtual('remaining').get(function () {
  return this.totalBudget - this.totalSpent;
});

budgetSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Budget', budgetSchema);