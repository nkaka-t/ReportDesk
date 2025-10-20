import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Grid, Card, CardContent, Typography } from '@mui/material';

export default function ReviewerDashboard(){
  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>Reviewer Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}><Card><CardContent><Typography>Reports to Review</Typography></CardContent></Card></Grid>
        <Grid item xs={12} md={6}><Card><CardContent><Typography>Pending Approvals</Typography></CardContent></Card></Grid>
      </Grid>
    </DashboardLayout>
  );
}
