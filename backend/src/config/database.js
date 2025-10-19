const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'reportdesk_db',
  process.env.DB_USER || 'reportdesk',
  process.env.DB_PASSWORD || 'reportdesk_pass',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    dialect: 'postgres',
    logging: false,
  }
);

module.exports = sequelize;
