const express = require('express');
const router = express.Router();
const { User, Department, Team } = require('../models');
const { hash } = require('../utils/hash');
const authenticate = require('../middleware/auth');
const requireRole = require('../middleware/roles');

// List users
router.get('/', authenticate, requireRole('admin','manager'), async (req, res) => {
  try {
    const users = await User.findAll({ order: [['created_at','DESC']], attributes: ['id','email','full_name','role','department_id','team_id'] });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create user
router.post('/', authenticate, requireRole('admin','manager'), async (req, res) => {
  try {
    const { email, password, full_name, role, department_id, team_id } = req.body;
    if (!email || !password || !full_name || !role) return res.status(400).json({ error: 'Missing required fields' });
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'User already exists' });
    if (department_id) {
      const dept = await Department.findByPk(department_id);
      if (!dept) return res.status(400).json({ error: 'Invalid department' });
    }
    if (team_id) {
      const team = await Team.findByPk(team_id);
      if (!team) return res.status(400).json({ error: 'Invalid team' });
    }
    const password_hash = await hash(password);
    const user = await User.create({ email, password_hash, full_name, role, department_id: department_id || null, team_id: team_id || null });
    res.status(201).json({ id: user.id, email: user.email, full_name: user.full_name, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user role/assignments
router.put('/:id', authenticate, requireRole('admin','manager'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    const { full_name, role, department_id, team_id } = req.body;
    if (full_name) user.full_name = full_name;
    if (role) user.role = role;
    if (typeof department_id !== 'undefined') {
      if (department_id) {
        const dept = await Department.findByPk(department_id);
        if (!dept) return res.status(400).json({ error: 'Invalid department' });
        user.department_id = department_id;
      } else {
        user.department_id = null;
      }
    }
    if (typeof team_id !== 'undefined') {
      if (team_id) {
        const team = await Team.findByPk(team_id);
        if (!team) return res.status(400).json({ error: 'Invalid team' });
        user.team_id = team_id;
        if (!user.department_id) user.department_id = team.department_id;
      } else {
        user.team_id = null;
      }
    }
    await user.save();
    res.json({ id: user.id, email: user.email, full_name: user.full_name, role: user.role, department_id: user.department_id, team_id: user.team_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

