const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register new user
exports.register = async (req, res) => {
  console.log('Registration attempt with:', req.body);
  const { name, email, password, country } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !password || !country) {
      console.log('Missing required fields:', { name, email, password, country });
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email is valid
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ message: 'Please enter a valid email' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      country,
    });

    console.log('User created successfully:', user.email);
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        country: user.country,
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
exports.login = async (req, res) => {
  console.log('Login attempt with:', req.body);
  const { email, password } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      console.log('Missing required fields:', { email, password });
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if email is valid
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ message: 'Please enter a valid email' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('User found, comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    console.log('Creating JWT token...');
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    console.log('JWT token created successfully');

    console.log('Login successful for user:', user.email);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email.toLowerCase(),
        country: user.country,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
