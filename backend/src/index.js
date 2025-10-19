require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const deptRoutes = require('./routes/departments');
const rtRoutes = require('./routes/reportTypes');

app.get('/', (req, res) => res.json({status: 'ok', name: 'ReportDesk API'}));

app.use('/api/auth', authRoutes);
app.use('/api/departments', deptRoutes);
app.use('/api/report-types', rtRoutes);

const start = async () => {
	try {
		await sequelize.authenticate();
		console.log('DB connection OK');
		await sequelize.sync();
		console.log('DB synchronized');
		app.listen(port, () => console.log(`Server listening on port ${port}`));
	} catch (err) {
		console.error('Failed to start server', err);
		process.exit(1);
	}
};

start();
