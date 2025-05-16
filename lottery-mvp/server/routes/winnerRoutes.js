const express = require('express');
const router = express.Router();
const Winner = require('../models/Winner');

// POST: Declare Winner
router.post('/declare', async (req, res) => {
  try {
    const { userId, lotteryNumber, drawDate } = req.body;
    const winner = new Winner({ userId, lotteryNumber, drawDate });
    await winner.save();
    res.status(201).json({ message: 'Winner declared successfully', winner });
  } catch (err) {
    res.status(500).json({ error: 'Failed to declare winner' });
  }
});

// GET: Winner List
router.get('/', async (req, res) => {
  try {
    const winners = await Winner.find().populate('userId', 'name email');
    res.status(200).json(winners);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch winners' });
  }
});

module.exports = router;
