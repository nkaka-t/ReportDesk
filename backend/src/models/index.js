const sequelize = require('../config/database');
const User = require('./user');
const Department = require('./department');
const ReportType = require('./reportType');
const Report = require('./report');
const ReviewHistory = require('./reviewHistory');
const Notification = require('./notification');
const Team = require('./team');
const ScheduledReport = require('./scheduledReport');
const Deliverable = require('./deliverable');

// Associations
User.belongsTo(Department, { foreignKey: 'department_id' });
Department.hasMany(User, { foreignKey: 'department_id' });
User.belongsTo(Team, { foreignKey: 'team_id' });
Team.hasMany(User, { foreignKey: 'team_id' });
Team.belongsTo(Department, { foreignKey: 'department_id' });
Department.hasMany(Team, { foreignKey: 'department_id' });
ReportType.belongsTo(Department, { foreignKey: 'department_id' });

Report.belongsTo(User, { foreignKey: 'user_id' });
Report.belongsTo(ReportType, { foreignKey: 'report_type_id' });
Report.belongsTo(Team, { foreignKey: 'team_id' });
Report.belongsTo(Deliverable, { foreignKey: 'deliverable_id' });
Deliverable.belongsTo(Report, { foreignKey: 'report_id' });
Deliverable.belongsTo(ReportType, { foreignKey: 'report_type_id' });
Deliverable.belongsTo(ScheduledReport, { foreignKey: 'scheduled_report_id' });
ReviewHistory.belongsTo(Report, { foreignKey: 'report_id' });
ReviewHistory.belongsTo(User, { foreignKey: 'reviewer_id' });
ScheduledReport.belongsTo(ReportType, { foreignKey: 'report_type_id' });
ScheduledReport.belongsTo(Department, { foreignKey: 'department_id' });
ScheduledReport.belongsTo(Team, { foreignKey: 'team_id' });
ScheduledReport.hasMany(Deliverable, { foreignKey: 'scheduled_report_id' });

module.exports = {
  sequelize,
  User,
  Department,
  ReportType,
  Report,
  ReviewHistory,
  Notification,
  Team,
  ScheduledReport,
  Deliverable,
};
