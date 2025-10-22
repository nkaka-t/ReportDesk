import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Grid, Card, CardContent, Typography } from '@mui/material';

export default function EmployeeDashboard(){
  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>Employee Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}><Card><CardContent><Typography>My Reports</Typography></CardContent></Card></Grid>
        <Grid item xs={12} md={4}><Card><CardContent><Typography>Upcoming Deadlines</Typography></CardContent></Card></Grid>
        <Grid item xs={12} md={4}><Card><CardContent><Typography>Compliance</Typography></CardContent></Card></Grid>
      </Grid>
    </DashboardLayout>
  );
}
