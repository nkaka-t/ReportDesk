import React, { useState } from 'react';
import api from '../api/axios';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';

export default function SubmitReport(){
  const [type, setType] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('report_type_id', type);
      fd.append('due_date', dueDate);
      if (file) fd.append('file', file);
      const res = await api.post('/reports/submit', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg('Submitted report id '+res.data.id);
    } catch (err:any) {
      console.error(err);
      setMsg('Submission failed');
    }
  };

  return (
    <Box sx={{maxWidth:600}}>
      <Typography variant="h4">Submit Report</Typography>
      <form onSubmit={submit}>
        <TextField label="Report Type ID" fullWidth value={type} onChange={e=>setType(e.target.value)} sx={{mb:2}} />
        <TextField label="Due Date" type="date" fullWidth value={dueDate} onChange={e=>setDueDate(e.target.value)} sx={{mb:2}} InputLabelProps={{shrink:true}} />
        <input type="file" onChange={e=>setFile(e.target.files ? e.target.files[0] : null)} />
        <Box sx={{mt:2}}>
          <Button type="submit" variant="contained">Submit</Button>
        </Box>
      </form>
      {msg && <Alert sx={{mt:2}}>{msg}</Alert>}
    </Box>
  );
}
