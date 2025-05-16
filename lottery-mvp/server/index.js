require('dotenv').config();
const adminRoutes = require('./routes/adminRoutes');
const Purchase = require('./models/Purchase');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { sendPurchaseEmail } = require('./utils/emailService');
const winnerRoutes = require('./routes/winnerRoutes');


const app = express();
const PORT = 5000;
const JWT_SECRET = "supersecretkey123"; // Secure rakhna        


app.use(cors());
app.use(express.json());

// MongoDB Connect
mongoose.connect('mongodb://127.0.0.1:27017/lotteryDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Test route
app.get('/', (req, res) => {
  res.send("Lottery API Running");
});

// Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const hashedPwd = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPwd });
    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '2h' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

//Buy & Get Lottery Number
// Buy & Get Lottery Number

app.post('/api/lottery/buy', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const { productName, productPrice } = req.body;

    // ✅ Pehle user fetch karo
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const lotteryNumber = Math.floor(100000 + Math.random() * 900000).toString();

    const newPurchase = new Purchase({
      user: userId,
      buyerName: user.name,
      buyerEmail: user.email,
      productName,
      productPrice,
      lotteryNumber
    });

    await newPurchase.save();

    const pdfPath = path.join(__dirname, '../client/public/pdfs', `${productName}.pdf`);

    await sendPurchaseEmail(user.email, lotteryNumber, productName, pdfPath);

    res.json({
      msg: 'Purchase successful',
      lotteryNumber
    });

  } catch (err) {
    console.error(err);
    res.status(403).json({ msg: 'Invalid token' });
  }
});

// Mark as Winner
app.put('/api/admin/purchases/:id/winner', async (req, res) => {
  try {
    const updated = await Purchase.findByIdAndUpdate(
      req.params.id,
      { isWinner: true },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

app.use('/api/admin', adminRoutes);

// winner routes
app.use('/api/winners', winnerRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


