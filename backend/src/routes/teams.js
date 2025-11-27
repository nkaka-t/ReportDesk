const express = require('express');
const router = express.Router();
const { Team, Department } = require('../models');
const authenticate = require('../middleware/auth');
const requireRole = require('../middleware/roles');

// Create team
router.post('/', authenticate, requireRole('admin','manager'), async (req, res) => {
  try {
    const { name, description, department_id } = req.body;
    if (!name || !department_id) return res.status(400).json({ error: 'Name and department_id required' });
    const department = await Department.findByPk(department_id);
    if (!department) return res.status(400).json({ error: 'Invalid department' });
    const team = await Team.create({ name, description: description || null, department_id });
    res.json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// List teams (optionally filter by department)
router.get('/', authenticate, requireRole('admin','manager'), async (req, res) => {
  try {
    const where = {};
    if (req.query.department_id) where.department_id = req.query.department_id;
    const teams = await Team.findAll({ where, order: [['name','ASC']] });
    res.json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update team
router.put('/:id', authenticate, requireRole('admin','manager'), async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) return res.status(404).json({ error: 'Not found' });
    const { name, description, department_id } = req.body;
    if (department_id) {
      const department = await Department.findByPk(department_id);
      if (!department) return res.status(400).json({ error: 'Invalid department' });
      team.department_id = department_id;
    }
    if (name) team.name = name;
    if (typeof description !== 'undefined') team.description = description;
    await team.save();
    res.json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete team
router.delete('/:id', authenticate, requireRole('admin','manager'), async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) return res.status(404).json({ error: 'Not found' });
    await team.destroy();
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

