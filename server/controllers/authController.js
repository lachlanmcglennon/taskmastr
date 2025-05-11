
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

const { generateCustomUserId } = require('../utils/idGenerator'); // adjust path as needed

exports.register = async (req, res) => {
  const { email, password, name, publicKey } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const userId = generateCustomUserId(); // new line

    const user = new User({
      userId,              // 👈 assign your custom string ID
      email,
      password: hashed,
      name,
      publicKey,
      teams: []
    });

    await user.save();

    const token = jwt.sign({ userId: user.userId, email: user.email }, JWT_SECRET);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.userId, email: user.email }, JWT_SECRET); // 👈 use user.userId
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};


exports.setPublicKey = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId }); // ✅ use userId, not _id
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.publicKey = req.body.publicKey;
    await user.save();
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};