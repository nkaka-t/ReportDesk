import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GavelIcon from '@mui/icons-material/Gavel';
import { Link as RouterLink } from 'react-router-dom';

const drawerWidth = 240;

export default function Sidebar(){
  return (
    <Drawer variant="permanent" sx={{width: drawerWidth, flexShrink:0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' } }}>
      <Toolbar />
      <Divider />
      <List>
        <ListItemButton component={RouterLink} to="/employee">
          <ListItemIcon><DashboardIcon/></ListItemIcon>
          <ListItemText primary="Employee" />
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/reviewer">
          <ListItemIcon><AssignmentIcon/></ListItemIcon>
          <ListItemText primary="Reviewer" />
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/approver">
          <ListItemIcon><GavelIcon/></ListItemIcon>
          <ListItemText primary="Approver" />
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/admin">
          <ListItemIcon><PeopleIcon/></ListItemIcon>
          <ListItemText primary="Admin" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
