const { sequelize, Department, ReportType, User, Team } = require('../models');
const { hash } = require('../utils/hash');

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB OK');

    // Create departments
    const depts = ['Finance', 'HR', 'Operations', 'IT'].map((name) => ({ name }));
    for (const d of depts) {
      await Department.findOrCreate({ where: { name: d.name }, defaults: d });
    }

    const finance = await Department.findOne({ where: { name: 'Finance' } });
    const it = await Department.findOne({ where: { name: 'IT' } });

    // Create teams
    if (finance) {
      await Team.findOrCreate({ where: { name: 'Finance FP&A', department_id: finance.id }, defaults: { name: 'Finance FP&A', department_id: finance.id } });
      await Team.findOrCreate({ where: { name: 'Payroll', department_id: finance.id }, defaults: { name: 'Payroll', department_id: finance.id } });
    }
    if (it) {
      await Team.findOrCreate({ where: { name: 'IT Support', department_id: it.id }, defaults: { name: 'IT Support', department_id: it.id } });
    }

    // Create some report types
    await ReportType.findOrCreate({ where: { name: 'Monthly Financials' }, defaults: { name: 'Monthly Financials', department_id: finance.id, frequency: 'monthly' } });

    const financeTeam = finance ? await Team.findOne({ where: { name: 'Finance FP&A', department_id: finance.id } }) : null;
    const itSupportTeam = it ? await Team.findOne({ where: { name: 'IT Support', department_id: it.id } }) : null;

    // Create users: admin, reviewer, approver, employee
    const users = [
      { email: 'admin@example.com', password: 'AdminPass123!', full_name: 'Admin User', role: 'admin', team_id: itSupportTeam ? itSupportTeam.id : null },
      { email: 'manager@example.com', password: 'ManagerPass123!', full_name: 'Global Manager', role: 'manager' },
      { email: 'reviewer@example.com', password: 'Reviewer123!', full_name: 'Dept Reviewer', role: 'reviewer', department_id: finance ? finance.id : null, team_id: financeTeam ? financeTeam.id : null },
      { email: 'approver@example.com', password: 'Approver123!', full_name: 'COO Approver', role: 'approver' },
      { email: 'employee@example.com', password: 'Employee123!', full_name: 'Regular Employee', role: 'employee', department_id: finance ? finance.id : null, team_id: financeTeam ? financeTeam.id : null }
    ];

    for (const u of users) {
      const [existing] = await User.findOrCreate({
        where: { email: u.email },
        defaults: {
          email: u.email,
          password_hash: await hash(u.password),
          full_name: u.full_name,
          role: u.role,
          department_id: u.department_id || null,
          team_id: u.team_id || null,
        }
      });
      if (existing) console.log('User exists', existing.email);
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
