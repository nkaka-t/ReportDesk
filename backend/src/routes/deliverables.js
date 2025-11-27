const express = require('express');
const router = express.Router();
const { Deliverable, ScheduledReport, Report, ReportType, Team } = require('../models');
const authenticate = require('../middleware/auth');
const requireRole = require('../middleware/roles');
const { Op } = require('sequelize');

const mapDeliverable = (d) => ({
  id: d.id,
  due_date: d.due_date,
  status: d.status,
  report_id: d.report_id,
  scheduled_report_id: d.scheduled_report_id,
  report_type_id: d.report_type_id,
  department_id: d.department_id,
  team_id: d.team_id,
  generated_at: d.generated_at,
});

router.get('/', authenticate, async (req, res) => {
  try {
    const where = {};
    if (req.user && req.user.role === 'employee') {
      where.department_id = req.user.department_id || null;
      const teamField = req.user.team_id || req.user.team;
      if (teamField) where.team_id = teamField;
    } else if (req.query.department_id) {
      where.department_id = req.query.department_id;
    }
    if (req.query.status) where.status = req.query.status;
    if (req.query.overdue === 'true') {
      where.status = { [Op.ne]: 'Completed' };
      where.due_date = { [Op.lt]: new Date() };
    }
    const deliverables = await Deliverable.findAll({
      where,
      include: [
        { model: ScheduledReport },
        { model: ReportType },
        { model: Report, attributes: ['id','title','status'] },
        { model: Team, attributes: ['id','name'] },
      ],
      order: [['due_date','ASC']],
    });
    res.json(deliverables.map((d) => ({
      ...mapDeliverable(d),
      schedule: d.ScheduledReport ? {
        name: d.ScheduledReport.name,
        frequency: d.ScheduledReport.frequency,
      } : null,
      report_type: d.ReportType ? d.ReportType.name : null,
      team: d.Team ? d.Team.name : null,
      report: d.Report ? { id: d.Report.id, title: d.Report.title, status: d.Report.status } : null,
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

