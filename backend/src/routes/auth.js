const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { hash, compare } = require('../utils/hash');
const { sign } = require('../utils/jwt');

// Register (admin use)
router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name, role, department_id, team } = req.body;
    if (!email || !password || !full_name || !role) return res.status(400).json({ error: 'Missing fields' });
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'User exists' });
    const password_hash = await hash(password);
    const user = await User.create({ email, password_hash, full_name, role, department_id, team });
    res.json({ id: user.id, email: user.email, full_name: user.full_name, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = sign({ id: user.id, role: user.role, email: user.email });
    res.json({ token, user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
