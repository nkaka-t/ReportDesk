import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Grid, Card, CardContent, Typography } from '@mui/material';

export default function ApproverDashboard(){
  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>Approver Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}><Card><CardContent><Typography>Awaiting Approval</Typography></CardContent></Card></Grid>
        <Grid item xs={12} md={6}><Card><CardContent><Typography>Approval History</Typography></CardContent></Card></Grid>
      </Grid>
    </DashboardLayout>
  );
}
