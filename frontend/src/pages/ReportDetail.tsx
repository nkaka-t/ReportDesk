import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';

export default function ReportDetail(){
  const { id } = useParams();
  const [report, setReport] = useState<any>(null);

  useEffect(()=>{
    const load = async () => {
      try {
        const res = await api.get('/reports/'+id);
        setReport(res.data);
      } catch (err) { console.error(err); }
    };
    load();
  }, [id]);

  if (!report) return <Typography>Loading...</Typography>;

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Report #{report.id}</Typography>
        <Typography>Status: {report.status}</Typography>
        <Typography>Submitted: {report.submitted_at}</Typography>
        <Box sx={{mt:2}}>
          <Button variant="contained" sx={{mr:1}}>Approve</Button>
          <Button variant="outlined">Request Revisions</Button>
        </Box>
      </CardContent>
    </Card>
  );
}
