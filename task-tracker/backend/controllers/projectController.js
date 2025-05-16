// src/controllers/projectController.js
const Project = require('../models/Project');
const Task = require('../models/Task');
const { validationResult } = require('express-validator');

/**
 * Create a new project
 * @route POST /api/projects
 * @access Private
 */
exports.createProject = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;

    // Check if user already has 4 projects
    const projectCount = await Project.countDocuments({ user: userId });
    if (projectCount >= 4) {
      return res.status(400).json({ 
        msg: 'You have reached the maximum limit of 4 projects. Please delete an existing project before creating a new one.' 
      });
    }

    // Create new project
    const { name, description } = req.body;
    
    const newProject = new Project({
      name,
      description,
      user: userId
    });

    const project = await newProject.save();
    res.status(201).json(project);
  } catch (err) {
    console.error('Error in createProject:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

/**
 * Get all projects for a user
 * @route GET /api/projects
 * @access Private
 */
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json(projects);
  } catch (err) {
    console.error('Error in getProjects:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

/**
 * Get a specific project by ID
 * @route GET /api/projects/:id
 * @access Private
 */
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    // Check if project exists
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    
    // Check project ownership
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    res.json(project);
  } catch (err) {
    console.error('Error in getProjectById:', err.message);
    
    // Check if error is due to invalid ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    
    res.status(500).json({ msg: 'Server error' });
  }
};

/**
 * Update a project
 * @route PUT /api/projects/:id
 * @access Private
 */
exports.updateProject = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, description } = req.body;
    
    // Find project by ID
    let project = await Project.findById(req.params.id);
    
    // Check if project exists
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    
    // Check project ownership
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Update project fields
    project.name = name || project.name;
    project.description = description || project.description;
    project.updatedAt = Date.now();
    
    await project.save();
    res.json(project);
  } catch (err) {
    console.error('Error in updateProject:', err.message);
    
    // Check if error is due to invalid ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    
    res.status(500).json({ msg: 'Server error' });
  }
};

/**
 * Delete a project and all its associated tasks
 * @route DELETE /api/projects/:id
 * @access Private
 */
exports.deleteProject = async (req, res) => {
  try {
    // Find project by ID
    const project = await Project.findById(req.params.id);
    
    // Check if project exists
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    
    // Check project ownership
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Delete all tasks associated with the project
    await Task.deleteMany({ project: req.params.id });
    
    // Delete the project
    await project.deleteOne();
    
    res.json({ msg: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error in deleteProject:', err.message);
    
    // Check if error is due to invalid ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    
    res.status(500).json({ msg: 'Server error' });
  }
};