import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

export default function Dashboard(){
  const token = localStorage.getItem('token');
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Card sx={{mb:2}}>
        <CardContent>
          <Typography variant="h6">Status</Typography>
          <Typography>{token ? 'Logged in' : 'Not logged in'}</Typography>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6">Reports</Typography>
          <Typography>Report lists and actions will appear here.</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
