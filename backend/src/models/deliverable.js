const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Deliverable = sequelize.define('Deliverable', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  scheduled_report_id: { type: DataTypes.INTEGER },
  department_id: { type: DataTypes.INTEGER },
  team_id: { type: DataTypes.INTEGER },
  report_type_id: { type: DataTypes.INTEGER, allowNull: false },
  due_date: { type: DataTypes.DATEONLY, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Pending' },
  report_id: { type: DataTypes.INTEGER },
  generated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'deliverables',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Deliverable;

