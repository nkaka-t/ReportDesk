import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';

export default function AdminDepartments(){
  const [name, setName] = useState('');
  const [departments, setDepartments] = useState<any[]>([]);

  const load = async () => {
    try { const res = await api.get('/departments'); setDepartments(res.data); } catch (err) { console.error(err); }
  };
  useEffect(()=>{ load(); }, []);

  const create = async () => {
    try { await api.post('/departments', { name }); setName(''); load(); } catch (err) { console.error(err); }
  };

  return (
    <Box>
      <Typography variant="h4">Manage Departments</Typography>
      <Box sx={{display:'flex', gap:2, mt:2}}>
        <TextField label="Name" value={name} onChange={e=>setName(e.target.value)} />
        <Button variant="contained" onClick={create}>Create</Button>
      </Box>
      <List>
        {departments.map(d => <ListItem key={d.id}><ListItemText primary={d.name} /></ListItem>)}
      </List>
    </Box>
  );
}
