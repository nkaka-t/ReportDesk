const express = require('express');
const router = express.Router();
const { ReportType } = require('../models');

// Create report type
router.post('/', async (req, res) => {
  try {
    const { name, department_id, frequency } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const rt = await ReportType.create({ name, department_id, frequency });
    res.json(rt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// List
router.get('/', async (req, res) => {
  try {
    const list = await ReportType.findAll();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
