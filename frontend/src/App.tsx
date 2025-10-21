import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Menu, MenuItem } from '@mui/material';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ReviewerDashboard from './pages/ReviewerDashboard';
import ApproverDashboard from './pages/ApproverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminDepartments from './pages/AdminDepartments';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
import SubmitReport from './pages/SubmitReport';
import ReportDetail from './pages/ReportDetail';
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material';

export default function App(){
  const [authed, setAuthed] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(()=>{
    const onAuth = () => setAuthed(!!localStorage.getItem('token'));
    window.addEventListener('authchange', onAuth);
    return () => window.removeEventListener('authchange', onAuth);
  },[]);

  const logout = () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('authchange'));
  };

  return (
      <>
     <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" edge="start" sx={{mr:1}} onClick={(e)=>setAnchorEl(e.currentTarget)}>
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={()=>setAnchorEl(null)}>
            <MenuItem onClick={()=>{ setAnchorEl(null); navigate('/'); }}>Dashboard</MenuItem>
            <MenuItem onClick={()=>{ setAnchorEl(null); navigate('/reports'); }}>Reports</MenuItem>
            <MenuItem onClick={()=>{ setAnchorEl(null); navigate('/submit'); }}>Submit Report</MenuItem>
            <MenuItem onClick={()=>{ setAnchorEl(null); navigate('/notifications'); }}>Notifications</MenuItem>
            <MenuItem onClick={()=>{ setAnchorEl(null); navigate('/admin'); }}>Admin</MenuItem>
            <MenuItem onClick={()=>{ setAnchorEl(null); navigate('/admin/departments'); }}>Departments</MenuItem>
            {!authed && <MenuItem onClick={()=>{ setAnchorEl(null); navigate('/login'); }}>Login</MenuItem>}
            {!authed && <MenuItem onClick={()=>{ setAnchorEl(null); navigate('/signup'); }}>Sign Up</MenuItem>}
            {authed && <MenuItem onClick={()=>{ setAnchorEl(null); logout(); }}>Logout</MenuItem>}
          </Menu>
          <Typography variant="h6" sx={{flexGrow:1, ml:1}}>ReportDesk</Typography>
          <Button color="inherit" component={Link} to="/">Dashboard</Button>
          {!authed && <Button color="inherit" component={Link} to="/login">Login</Button>}
          {!authed && <Button color="inherit" component={Link} to="/signup">Sign Up</Button>}
          {authed && <Button color="inherit" onClick={logout}>Logout</Button>}
        </Toolbar>
        </AppBar>
        <Container sx={{mt:4}}>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/reports" element={<Reports/>} />
          <Route path="/submit" element={<SubmitReport/>} />
          <Route path="/reports/:id" element={<ReportDetail/>} />
          <Route path="/notifications" element={<Notifications/>} />
          <Route path="/employee" element={<EmployeeDashboard/>} />
          <Route path="/reviewer" element={<ReviewerDashboard/>} />
          <Route path="/approver" element={<ApproverDashboard/>} />
          <Route path="/admin" element={<AdminDashboard/>} />
          <Route path="/admin/departments" element={<AdminDepartments/>} />
        </Routes>
        </Container>
      </>
    );
  }
