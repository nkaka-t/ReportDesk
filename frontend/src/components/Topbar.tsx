import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

export default function Topbar(){
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    // notify other parts of the app that auth changed (same-tab)
    window.dispatchEvent(new Event('authchange'));
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
      <Toolbar>
        <IconButton color="inherit" edge="start" sx={{mr:2}}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{flexGrow:1}}>ReportDesk</Typography>
        <Button color="inherit" onClick={logout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
}
