import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function Topbar(){
  return (
    <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
      <Toolbar>
        <IconButton color="inherit" edge="start" sx={{mr:2}}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">ReportDesk</Typography>
      </Toolbar>
    </AppBar>
  );
}
