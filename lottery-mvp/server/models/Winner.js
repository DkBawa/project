const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lotteryNumber: String,
  drawDate: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Winner', winnerSchema);
