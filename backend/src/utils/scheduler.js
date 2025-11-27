const { ScheduledReport, Deliverable } = require('../models');

const parseFrequency = (frequency) => {
  const freq = String(frequency || '').toLowerCase();
  if (['monthly','quarterly','biweekly','weekly','daily'].includes(freq)) return freq;
  return 'monthly';
};

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const calcNextDue = (frequency, currentDue, fallback = new Date()) => {
  const base = currentDue ? new Date(currentDue) : new Date(fallback);
  switch (parseFrequency(frequency)) {
    case 'weekly':
      return addDays(base, 7);
    case 'biweekly':
      return addDays(base, 14);
    case 'quarterly':
      base.setMonth(base.getMonth() + 3);
      return base;
    case 'daily':
      return addDays(base, 1);
    case 'monthly':
    default:
      base.setMonth(base.getMonth() + 1);
      return base;
  }
};

const generateDeliverables = async () => {
  const now = new Date();
  const schedules = await ScheduledReport.findAll({ where: { active: true } });
  for (const schedule of schedules) {
    if (!schedule.next_due_at) continue;
    const nextDue = new Date(schedule.next_due_at);
    if (nextDue <= now) {
      const deliverable = await Deliverable.create({
        scheduled_report_id: schedule.id,
        department_id: schedule.department_id,
        team_id: schedule.team_id || null,
        report_type_id: schedule.report_type_id,
        due_date: nextDue.toISOString().split('T')[0],
        status: 'Pending',
      });
      schedule.last_generated_at = new Date();
      schedule.next_due_at = calcNextDue(schedule.frequency, nextDue).toISOString();
      await schedule.save();
      console.log('[scheduler] generated deliverable', deliverable.id, 'for schedule', schedule.id);
    }
  }
};

const startScheduler = () => {
  const intervalMs = parseInt(process.env.SCHEDULER_INTERVAL_MS || '300000', 10);
  setTimeout(() => generateDeliverables().catch((err) => console.error('[scheduler] run failed', err)), 2000);
  setInterval(() => {
    generateDeliverables().catch((err) => console.error('[scheduler] run failed', err));
  }, intervalMs);
  console.log(`[scheduler] started interval every ${intervalMs}ms`);
};

module.exports = { startScheduler, generateDeliverables };
