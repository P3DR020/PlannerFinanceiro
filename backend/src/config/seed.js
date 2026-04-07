require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');
const Transaction = require('../models/transaction');
const Budget = require('../models/budget');
const SavingsGoal = require('../models/SavingsGoal');

const connectDB = require('./database');

const seed = async () => {
  await connectDB();

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Transaction.deleteMany({}),
    Budget.deleteMany({}),
    SavingsGoal.deleteMany({}),
  ]);

  // Create demo user
  const user = await User.create({
    name: 'Alex Sterling',
    email: 'alex@theledger.com',
    password: 'password123',
    plan: 'premium',
  });

  console.log('✅ User created:', user.email);

  // Create transactions (last 6 months)
  const categories = ['investment', 'real_estate', 'software', 'revenue', 'travel', 'dining', 'housing', 'transport', 'shopping'];
  const methods = ['credit_card', 'wire_transfer', 'ach_transfer'];
  const transactions = [];

  for (let m = 5; m >= 0; m--) {
    for (let i = 0; i < 20; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - m);
      date.setDate(Math.floor(Math.random() * 28) + 1);

      const isInflow = Math.random() > 0.6;
      transactions.push({
        user: user._id,
        description: isInflow ? ['Client Retainer', 'Goldman Sachs Dividend', 'Project Milestone'][Math.floor(Math.random() * 3)] : ['AWS Infrastructure', 'Blue Fin Omakase', 'Delta Airlines', 'Avenue Properties'][Math.floor(Math.random() * 4)],
        amount: isInflow ? Math.round(Math.random() * 15000 + 1000) : Math.round(Math.random() * 3000 + 100),
        type: isInflow ? 'inflow' : 'outflow',
        category: categories[Math.floor(Math.random() * categories.length)],
        paymentMethod: methods[Math.floor(Math.random() * methods.length)],
        date,
      });
    }
  }

  await Transaction.insertMany(transactions);
  console.log(`✅ ${transactions.length} transactions created`);

  // Create current month budget
  const now = new Date();
  await Budget.create({
    user: user._id,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    totalBudget: 12000,
    categories: [
      { name: 'Housing', category: 'housing', limit: 2500, spent: 2100 },
      { name: 'Food & Dining', category: 'dining', limit: 800, spent: 924 },
      { name: 'Leisure', category: 'shopping', limit: 600, spent: 150 },
      { name: 'Transport', category: 'transport', limit: 450, spent: 320 },
      { name: 'Software', category: 'software', limit: 500, spent: 845 },
    ],
  });
  console.log('✅ Budget created');

  // Create savings goals
  await SavingsGoal.insertMany([
    {
      user: user._id,
      name: 'Emergency Reserve Fund',
      description: 'Targeting 6 months of luxury overhead',
      targetAmount: 100000,
      savedAmount: 85000,
      targetDate: new Date('2024-10-01'),
      status: 'active',
      track: 'accelerated',
      monthlyContribution: 2500,
      contributions: [
        { amount: 2500, note: 'Scheduled Transfer', type: 'scheduled', date: new Date('2024-05-12') },
      ],
    },
    {
      user: user._id,
      name: 'Amalfi Coast Sabbatical',
      description: 'Dream Trip 2025',
      targetAmount: 45000,
      savedAmount: 22500,
      targetDate: new Date('2025-06-01'),
      status: 'active',
      track: 'on_schedule',
      contributions: [
        { amount: 5000, note: 'Manual Deposit - Bonus Injection', type: 'manual', date: new Date('2024-05-08') },
      ],
    },
    {
      user: user._id,
      name: 'EV Replacement Fund',
      description: 'Asset upgrade cycle',
      targetAmount: 75000,
      savedAmount: 35000,
      targetDate: new Date('2025-12-01'),
      status: 'active',
      track: 'on_schedule',
      contributions: [
        { amount: 842.15, note: 'Dividend Reinvestment', type: 'dividend_reinvestment', date: new Date('2024-05-01') },
      ],
    },
  ]);
  console.log('✅ Savings goals created');

  console.log('\n🎉 Seed complete!');
  console.log('Login: alex@theledger.com / password123');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});