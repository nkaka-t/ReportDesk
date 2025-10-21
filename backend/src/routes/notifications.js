const express = require('express');
const router = express.Router();
const { Notification } = require('../models');

// List notifications
router.get('/', async (req, res) => {
  try {
    const list = await Notification.findAll({ order: [['created_at','DESC']] });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
