const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  buyerName: String,
  buyerEmail: String,
  productName: String,
  productPrice: Number,
  lotteryNumber: String,
  isWinner: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });

module.exports = mongoose.model('Purchase', PurchaseSchema);
