const express = require('express');
const router = express.Router();
const { Report, ReportType, Department, sequelize } = require('../models');
const { Op } = require('sequelize');

// GET /api/stats
router.get('/', async (req, res) => {
  try {
    // total reports
    const totalReports = await Report.count();

    // pending review
    const pendingReview = await Report.count({ where: { status: 'Pending' } });

    // needs attention: rejected OR pending with review_comments
    const needsAttention = await Report.count({
      where: {
        [Op.or]: [
          { status: 'Rejected' },
          { [Op.and]: [{ status: 'Pending' }, { review_comments: { [Op.ne]: null } }] }
        ]
      }
    });

    // approved this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const approvedThisMonth = await Report.count({
      where: {
        status: 'Approved',
        approved_at: { [Op.gte]: startOfMonth, [Op.lt]: endOfMonth }
      }
    });

    // department activity
    const depts = await Department.findAll({ order: [['name','ASC']] });
    const departmentActivity = [];
    for (const d of depts) {
      // total reports for this department (reports whose report type belongs to this department)
      const total = await Report.count({
        include: [{ model: ReportType, where: { department_id: d.id } }]
      });
      const approved = await Report.count({
        where: { status: 'Approved' },
        include: [{ model: ReportType, where: { department_id: d.id } }]
      });
      const completion = total > 0 ? Math.round((approved / total) * 100) : 0;
      departmentActivity.push({ id: d.id, name: d.name, reports: total, completion });
    }

    res.json({ totalReports, pendingReview, approvedThisMonth, needsAttention, departmentActivity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
