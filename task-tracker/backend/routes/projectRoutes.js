// backend/routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const projectController = require('../controllers/projectController');

/**
 * @route   POST api/projects
 * @desc    Create a new project
 * @access  Private
 */
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Project name is required').not().isEmpty(),
    ]
  ],
  projectController.createProject
);

/**
 * @route   GET api/projects
 * @desc    Get all projects for a user
 * @access  Private
 */
router.get('/', auth, projectController.getProjects);

/**
 * @route   GET api/projects/:id
 * @desc    Get project by ID
 * @access  Private
 */
router.get('/:id', auth, projectController.getProjectById);

/**
 * @route   PUT api/projects/:id
 * @desc    Update a project
 * @access  Private
 */
router.put(
  '/:id',
  [
    auth,
    [
      check('name', 'Project name is required').not().isEmpty(),
    ]
  ],
  projectController.updateProject
);

/**
 * @route   DELETE api/projects/:id
 * @desc    Delete a project
 * @access  Private
 */
router.delete('/:id', auth, projectController.deleteProject);

module.exports = router;