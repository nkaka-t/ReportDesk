import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Alert } from '@mui/material';

export default function Login(){
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email, password: pass });
      setMsg('Logged in: ' + res.data.user.email);
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      setMsg('Login failed');
    }
  };

  return (
    <Box sx={{maxWidth:480}}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <TextField fullWidth label="Email" value={email} onChange={e=>setEmail(e.target.value)} sx={{mb:2}} />
        <TextField fullWidth label="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} sx={{mb:2}} />
        <Button variant="contained" type="submit">Login</Button>
      </form>
      {msg && <Alert severity="info" sx={{mt:2}}>{msg}</Alert>}
    </Box>
  );
}
