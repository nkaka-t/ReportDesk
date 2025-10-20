import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Grid, Card, CardContent, Typography } from '@mui/material';

export default function AdminDashboard(){
  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}><Card><CardContent><Typography>Departments</Typography></CardContent></Card></Grid>
        <Grid item xs={12} md={4}><Card><CardContent><Typography>Users</Typography></CardContent></Card></Grid>
        <Grid item xs={12} md={4}><Card><CardContent><Typography>Report Types</Typography></CardContent></Card></Grid>
      </Grid>
    </DashboardLayout>
  );
}
