const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters'],
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
  },
  type: {
    type: String,
    enum: ['inflow', 'outflow'],
    required: true,
  },
  category: {
    type: String,
    enum: [
      'investment', 'real_estate', 'software', 'revenue', 'travel',
      'dining', 'housing', 'transport', 'shopping', 'leisure',
      'technology', 'healthcare', 'education', 'utilities', 'other'
    ],
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'wire_transfer', 'ach_transfer', 'cash', 'check', 'crypto', 'other'],
    default: 'other',
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
  },
  merchant: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurringFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'annually', null],
    default: null,
  },
}, { timestamps: true });

// Indexes for performance
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1 });
transactionSchema.index({ user: 1, type: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);