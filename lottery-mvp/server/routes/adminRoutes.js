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

// DELETE a specific purchase
router.delete('/purchases/:id', async (req, res) => {
  try {
    const deleted = await Purchase.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("Purchase not found");
    res.status(200).send("Purchase deleted successfully");
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;


