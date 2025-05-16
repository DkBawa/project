const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

// @route   GET /api/tasks
// @desc    Get all tasks
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // TODO: Implement get all tasks
    res.json({ message: 'Get all tasks route' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/tasks/:id
// @desc    Get task by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    // TODO: Implement get task by ID
    res.json({ message: 'Get task by ID route' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/tasks
// @desc    Create a task
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    // TODO: Implement create task
    res.json({ message: 'Create task route' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    // TODO: Implement update task
    res.json({ message: 'Update task route' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // TODO: Implement delete task
    res.json({ message: 'Delete task route' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
