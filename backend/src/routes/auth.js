const express = require('express');
const router = express.Router();
const { User, Department, Team } = require('../models');
const { hash, compare } = require('../utils/hash');
const { sign } = require('../utils/jwt');
const authenticate = require('../middleware/auth');

// Register (admin use)
// Public registration: users can register but cannot assign themselves elevated roles.
// Only an authenticated admin may create users with arbitrary roles (handled elsewhere in Admin UI).
router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name, role: requestedRole, department_id, department_name, team_id, team_name, team, manager_secret } = req.body;
    if (!email || !password || !full_name) return res.status(400).json({ error: 'Missing fields' });
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'User exists' });
    // default to 'employee'. If client requests 'manager' role, enforce secret unless explicitly allowed.
    let role = 'employee';
    if (requestedRole && String(requestedRole).toLowerCase() === 'manager') {
      const allowManager = String(process.env.ALLOW_MANAGER_REG || '').toLowerCase() === 'true';
      const configuredSecret = process.env.MANAGER_REG_SECRET || '';
      if (!allowManager) {
        if (!configuredSecret || !manager_secret || manager_secret !== configuredSecret) {
          return res.status(403).json({ error: 'Manager registration requires a valid secret' });
        }
      }
      role = 'manager';
    } else if (requestedRole && typeof requestedRole === 'string') {
      role = requestedRole.toLowerCase();
    }
    const password_hash = await hash(password);
    // Resolve department_id: allow numeric id or department name (case-insensitive)
    let deptId = null;
    if (department_id !== undefined && department_id !== null && department_id !== '') {
      if (!isNaN(parseInt(department_id, 10))) {
        deptId = parseInt(department_id, 10);
      }
    }
    if (!deptId && department_name) {
      const found = await Department.findOne({ where: { name: department_name } });
      if (found) deptId = found.id;
    }

    // Resolve team
    let resolvedTeamId = null;
    if (team_id) {
      const teamRecord = await Team.findByPk(team_id);
      if (teamRecord) {
        resolvedTeamId = teamRecord.id;
        if (!deptId) deptId = teamRecord.department_id;
      }
    } else if (team_name) {
      const where = deptId ? { name: team_name, department_id: deptId } : { name: team_name };
      const teamRecord = await Team.findOne({ where });
      if (teamRecord) {
        resolvedTeamId = teamRecord.id;
        if (!deptId) deptId = teamRecord.department_id;
      }
    }

    const user = await User.create({ email, password_hash, full_name, role, department_id: deptId, team: team || null, team_id: resolvedTeamId });
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

// Get current authenticated user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: ['id','email','full_name','role','department_id','team'] });
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
