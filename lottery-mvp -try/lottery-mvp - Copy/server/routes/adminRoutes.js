const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');

// GET all purchases
router.get('/purchases', async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ purchaseDate: -1 }); // Latest first
    res.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

