const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ScheduledReport = sequelize.define('ScheduledReport', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  department_id: { type: DataTypes.INTEGER, allowNull: false },
  team_id: { type: DataTypes.INTEGER },
  report_type_id: { type: DataTypes.INTEGER, allowNull: false },
  frequency: { type: DataTypes.STRING, allowNull: false }, // monthly, quarterly, biweekly, weekly
  day_of_period: { type: DataTypes.INTEGER, allowNull: true }, // e.g. day of month or weekday index
  next_due_at: { type: DataTypes.DATE, allowNull: false },
  last_generated_at: { type: DataTypes.DATE },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'scheduled_reports',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = ScheduledReport;
