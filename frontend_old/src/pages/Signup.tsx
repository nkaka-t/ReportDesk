import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Alert, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

export default function Signup(){
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [role, setRole] = useState('employee');
  const [msg, setMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', { email, password: pass, full_name: name, role });
      setMsg('Registered. Ask admin to assign roles if needed.');
    } catch (err) {
      setMsg('Registration failed');
    }
  };

  return (
    <Box sx={{maxWidth:480}}>
      <h2>Sign Up</h2>
      <form onSubmit={submit}>
        <TextField fullWidth label="Full name" value={name} onChange={e=>setName(e.target.value)} sx={{mb:2}} />
        <TextField fullWidth label="Email" value={email} onChange={e=>setEmail(e.target.value)} sx={{mb:2}} />
        <TextField fullWidth label="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} sx={{mb:2}} />
        <FormControl fullWidth sx={{mb:2}}>
          <InputLabel id="role-label">Role</InputLabel>
          <Select labelId="role-label" value={role} label="Role" onChange={e=>setRole(e.target.value)}>
            <MenuItem value="employee">Employee</MenuItem>
            <MenuItem value="reviewer">Reviewer</MenuItem>
            <MenuItem value="approver">Approver</MenuItem>
            {/* Do NOT expose admin creation to public signup */}
          </Select>
        </FormControl>
        <Button variant="contained" type="submit">Sign up</Button>
      </form>
      {msg && <Alert severity="info" sx={{mt:2}}>{msg}</Alert>}
    </Box>
  );
}
