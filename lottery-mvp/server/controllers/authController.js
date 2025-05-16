const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ msg: "Email already exists" });

    const hashPass = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashPass });

    res.status(201).json({ msg: "User Registered", user: newUser });
  } catch (err) {
    res.status(500).json({ msg: "Error", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ msg: "Login success", token, user });
  } catch (err) {
    res.status(500).json({ msg: "Error", error: err.message });
  }
};
