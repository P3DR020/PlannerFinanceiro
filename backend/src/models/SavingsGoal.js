const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  note: String,
  date: { type: Date, default: Date.now },
  type: {
    type: String,
    enum: ['manual', 'scheduled', 'dividend_reinvestment', 'bonus'],
    default: 'manual',
  },
});

const savingsGoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Goal name is required'],
    trim: true,
  },
  description: String,
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required'],
    min: [1, 'Target amount must be positive'],
  },
  savedAmount: {
    type: Number,
    default: 0,
  },
  targetDate: {
    type: Date,
    required: true,
  },
  icon: { type: String, default: '🎯' },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active',
  },
  track: {
    type: String,
    enum: ['on_schedule', 'accelerated', 'behind', 'at_risk'],
    default: 'on_schedule',
  },
  monthlyContribution: {
    type: Number,
    default: 0,
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  contributions: [contributionSchema],
}, { timestamps: true });

// Virtual: completion percentage
savingsGoalSchema.virtual('completionPercentage').get(function () {
  return Math.min(Math.round((this.savedAmount / this.targetAmount) * 100), 100);
});

// Virtual: remaining amount
savingsGoalSchema.virtual('remainingAmount').get(function () {
  return Math.max(this.targetAmount - this.savedAmount, 0);
});

savingsGoalSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('SavingsGoal', savingsGoalSchema);