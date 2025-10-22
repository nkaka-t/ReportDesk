import React from 'react';

export default function Dashboard(){
  const token = localStorage.getItem('token');
  return (
    <div style={{padding:20}}>
      <h2>Dashboard</h2>
      {token ? <p>Logged in (token present)</p> : <p>Not logged in</p>}
      <p>Placeholder dashboard. More UI coming.</p>
    </div>
  );
}
