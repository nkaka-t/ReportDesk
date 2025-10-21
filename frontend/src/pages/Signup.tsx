import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Alert } from '@mui/material';

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
        <TextField fullWidth label="Role" value={role} onChange={e=>setRole(e.target.value)} sx={{mb:2}} />
        <Button variant="contained" type="submit">Sign up</Button>
      </form>
      {msg && <Alert severity="info" sx={{mt:2}}>{msg}</Alert>}
    </Box>
  );
}
