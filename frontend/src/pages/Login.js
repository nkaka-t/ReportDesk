import React, { useState } from 'react';
import axios from 'axios';

export default function Login(){
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
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
    <div style={{padding:20}}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          <label>Email</label><br/>
          <input value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label><br/>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
      <div>{msg}</div>
    </div>
  );
}
