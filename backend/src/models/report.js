const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER },
  report_type_id: { type: DataTypes.INTEGER },
  file_path: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'Pending' },
  due_date: { type: DataTypes.DATEONLY },
  submitted_at: { type: DataTypes.DATE },
  version: { type: DataTypes.INTEGER, defaultValue: 1 }
}, {
  tableName: 'reports',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Report;
