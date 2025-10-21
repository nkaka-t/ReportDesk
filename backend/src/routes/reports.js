const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Report, ReportType, ReviewHistory, User, Notification } = require('../models');
const authenticate = require('../middleware/auth');
const requireRole = require('../middleware/roles');
const { createNotification } = require('../utils/notify');

const uploadDir = path.join(process.cwd(), 'reports_uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Submit report (employee)
router.post('/submit', authenticate, requireRole('employee','admin'), upload.single('file'), async (req, res) => {
  try {
    const { report_type_id, due_date } = req.body;
    const file_path = req.file ? req.file.path : null;
  const report = await Report.create({ user_id: req.user.id, report_type_id, file_path, due_date, status: 'Pending', submitted_at: new Date() });
  // notify department reviewer(s) - simplistic: notify first reviewer in same department
  const rt = await ReportType.findByPk(report.report_type_id);
  const reviewer = await User.findOne({ where: { role: 'reviewer', department_id: rt.department_id } });
  if (reviewer) await createNotification({ user_id: reviewer.id, type: 'New Report Submitted', payload: { reportId: report.id, from: req.user.id, toEmail: reviewer.email }, sendEmail: false });
  res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// List reports (public for now)
router.get('/', async (req, res) => {
  try {
    const list = await Report.findAll({ order: [['created_at','DESC']] });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single report
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) return res.status(404).json({ error: 'Not found' });
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reviewer action: review and forward
router.post('/:id/review', authenticate, requireRole('reviewer','admin'), async (req, res) => {
  try {
    const { action, comments } = req.body; // action: Reviewed/Request Revisions/Rejected
    const report = await Report.findByPk(req.params.id);
    if (!report) return res.status(404).json({ error: 'Not found' });
  await ReviewHistory.create({ report_id: report.id, reviewer_id: req.user.id, action, comments });
    // update status
    report.status = action === 'Reviewed' ? 'Reviewed' : action === 'Rejected' ? 'Rejected' : 'Pending';
    await report.save();
    // notify approver if reviewed
    if (report.status === 'Reviewed') {
      const approver = await User.findOne({ where: { role: 'approver' } });
      if (approver) await createNotification({ user_id: approver.id, type: 'Report Ready for Approval', payload: { reportId: report.id, from: req.user.id, toEmail: approver.email }, sendEmail: false });
    }
    res.json({ ok: true, status: report.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Approver action
router.post('/:id/approve', authenticate, requireRole('approver','admin'), async (req, res) => {
  try {
    const { action, comments } = req.body; // action: Approved/Rejected
    const report = await Report.findByPk(req.params.id);
    if (!report) return res.status(404).json({ error: 'Not found' });
  await ReviewHistory.create({ report_id: report.id, reviewer_id: req.user.id, action, comments });
  report.status = action === 'Approved' ? 'Approved' : 'Rejected';
  await report.save();
  // notify original submitter
  const submitter = await User.findByPk(report.user_id);
  if (submitter) await createNotification({ user_id: submitter.id, type: `Report ${report.status}`, payload: { reportId: report.id, status: report.status, comments }, sendEmail: false });
  res.json({ ok: true, status: report.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
