const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ReportType = require('./reportType');

const Department = sequelize.define('Department', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: 'departments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Add association with cascading delete
Department.hasMany(ReportType, {
  foreignKey: 'department_id',
  onDelete: 'CASCADE',
});

module.exports = Department;
