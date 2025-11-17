const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Report = require('./report');

const ReportType = sequelize.define('ReportType', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  department_id: { type: DataTypes.INTEGER },
  frequency: { type: DataTypes.STRING }
}, {
  tableName: 'report_types',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Add association with cascading delete
ReportType.hasMany(Report, {
  foreignKey: 'report_type_id',
  onDelete: 'CASCADE',
});

module.exports = ReportType;
