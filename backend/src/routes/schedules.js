const express = require('express');
const router = express.Router();
const { ScheduledReport, Department, Team, ReportType } = require('../models');
const authenticate = require('../middleware/auth');
const requireRole = require('../middleware/roles');

const serialize = (schedule) => ({
  id: schedule.id,
  name: schedule.name,
  department_id: schedule.department_id,
  team_id: schedule.team_id,
  report_type_id: schedule.report_type_id,
  frequency: schedule.frequency,
  day_of_period: schedule.day_of_period,
  next_due_at: schedule.next_due_at,
  last_generated_at: schedule.last_generated_at,
  active: schedule.active,
});

router.get('/', authenticate, requireRole('admin','manager'), async (req, res) => {
  try {
    const schedules = await ScheduledReport.findAll({ order: [['created_at','DESC']] });
    res.json(schedules.map(serialize));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticate, requireRole('admin','manager'), async (req, res) => {
  try {
    const { name, department_id, team_id, report_type_id, frequency, day_of_period, next_due_at } = req.body;
    if (!name || !department_id || !report_type_id || !frequency || !next_due_at) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const dept = await Department.findByPk(department_id);
    if (!dept) return res.status(400).json({ error: 'Invalid department' });
    if (team_id) {
      const team = await Team.findByPk(team_id);
      if (!team || team.department_id !== department_id) {
        return res.status(400).json({ error: 'Team must belong to department' });
      }
    }
    const rt = await ReportType.findByPk(report_type_id);
    if (!rt) return res.status(400).json({ error: 'Invalid report type' });

    const schedule = await ScheduledReport.create({
      name,
      department_id,
      team_id: team_id || null,
      report_type_id,
      frequency,
      day_of_period: day_of_period || null,
      next_due_at,
    });
    res.status(201).json(serialize(schedule));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authenticate, requireRole('admin','manager'), async (req, res) => {
  try {
    const schedule = await ScheduledReport.findByPk(req.params.id);
    if (!schedule) return res.status(404).json({ error: 'Not found' });
    const { name, department_id, team_id, report_type_id, frequency, day_of_period, next_due_at, active } = req.body;
    if (department_id) {
      const dept = await Department.findByPk(department_id);
      if (!dept) return res.status(400).json({ error: 'Invalid department' });
      schedule.department_id = department_id;
    }
    if (team_id !== undefined) {
      if (team_id) {
        const team = await Team.findByPk(team_id);
        if (!team) return res.status(400).json({ error: 'Invalid team' });
        schedule.team_id = team_id;
      } else {
        schedule.team_id = null;
      }
    }
    if (report_type_id) {
      const rt = await ReportType.findByPk(report_type_id);
      if (!rt) return res.status(400).json({ error: 'Invalid report type' });
      schedule.report_type_id = report_type_id;
    }
    if (name) schedule.name = name;
    if (frequency) schedule.frequency = frequency;
    if (day_of_period !== undefined) schedule.day_of_period = day_of_period;
    if (next_due_at) schedule.next_due_at = next_due_at;
    if (typeof active === 'boolean') schedule.active = active;
    await schedule.save();
    res.json(serialize(schedule));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticate, requireRole('admin','manager'), async (req, res) => {
  try {
    const schedule = await ScheduledReport.findByPk(req.params.id);
    if (!schedule) return res.status(404).json({ error: 'Not found' });
    await schedule.destroy();
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

