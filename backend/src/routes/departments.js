const express = require('express');
const router = express.Router();
const { Department } = require('../models');
const authenticate = require('../middleware/auth');
const requireRole = require('../middleware/roles');

// Create department (admin)
router.post('/', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const existing = await Department.findOne({ where: { name } });
    if (existing) return res.status(400).json({ error: 'Department exists' });
    const d = await Department.create({ name });
    res.json(d);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// List departments
router.get('/', async (req, res) => {
  try {
    const list = await Department.findAll();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
