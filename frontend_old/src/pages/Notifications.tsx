import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

export default function Notifications(){
  const [notes, setNotes] = useState<any[]>([]);
  const load = async () => { try { const res = await api.get('/notifications'); setNotes(res.data); } catch (err) { console.error(err); } };
  useEffect(()=>{ load(); }, []);
  return (
    <Box>
      <Typography variant="h4">Notifications</Typography>
      <List>
        {notes.map(n => <ListItem key={n.id}><ListItemText primary={n.type} secondary={JSON.stringify(n.payload)} /></ListItem>)}
      </List>
    </Box>
  );
}
