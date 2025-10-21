import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Box, Typography, Card, CardContent, Grid, Button, Select, MenuItem, TextField } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Reports(){
  const [reports, setReports] = useState<any[]>([]);
  const [query, setQuery] = useState('');

  const load = async () => {
    try {
      const res = await api.get('/reports');
      setReports(res.data || []);
    } catch (err) {
      console.error('Failed to load reports', err);
    }
  };

  useEffect(()=>{ load(); }, []);

  const filtered = reports.filter(r => !query || (r.status && r.status.toLowerCase().includes(query.toLowerCase())) );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Reports</Typography>
      <Box sx={{display:'flex', gap:2, mb:2}}>
        <TextField label="Filter by status" value={query} onChange={e=>setQuery(e.target.value)} />
        <Button variant="contained" component={RouterLink} to="/submit">Submit Report</Button>
      </Box>
      <Grid container spacing={2}>
        {filtered.map(r => (
          <Grid item xs={12} md={6} key={r.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">Report #{r.id} - {r.status}</Typography>
                <Typography variant="body2">Type: {r.report_type_id || 'N/A'}</Typography>
                <Typography variant="body2">Submitted: {r.submitted_at || '—'}</Typography>
                <Box sx={{mt:1}}>
                  <Button size="small" component={RouterLink} to={`/reports/${r.id}`}>View</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
