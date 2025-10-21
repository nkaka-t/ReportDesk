import React from 'react';
import { Box, Toolbar } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function DashboardLayout({children}:{children:React.ReactNode}){
  return (
    <Box sx={{display:'flex'}}>
      <Topbar />
      <Sidebar />
      <Box component="main" sx={{flexGrow:1, p:3}}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
