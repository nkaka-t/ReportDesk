require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const deptRoutes = require('./routes/departments');
const rtRoutes = require('./routes/reportTypes');
const reportsRoutes = require('./routes/reports');
const notificationsRoutes = require('./routes/notifications');

app.get('/', (req, res) => res.json({status: 'ok', name: 'ReportDesk API'}));

app.use('/api/auth', authRoutes);
app.use('/api/departments', deptRoutes);
app.use('/api/report-types', rtRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/notifications', notificationsRoutes);

// If a built frontend exists (frontend/dist), serve it as static files so
// visiting the server root shows the new Vite frontend in production.
const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
	app.use(express.static(frontendDist));
	// Serve index.html for any non-API route
	app.get('*', (req, res, next) => {
		if (req.path.startsWith('/api')) return next();
		res.sendFile(path.join(frontendDist, 'index.html'));
	});
}

const { waitForDb } = require('./utils/dbWait');

const start = async () => {
	try {
		await waitForDb(sequelize, 8, 2000);
		await sequelize.sync();
		console.log('DB synchronized');
		app.listen(port, () => console.log(`Server listening on port ${port}`));
	} catch (err) {
		console.error('Failed to start server', err);
		process.exit(1);
	}
};

start();
