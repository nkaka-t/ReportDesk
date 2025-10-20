import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ReviewerDashboard from './pages/ReviewerDashboard';
import ApproverDashboard from './pages/ApproverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material';

export default function App(){
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{flexGrow:1}}>ReportDesk</Typography>
          <Button color="inherit" component={Link} to="/">Dashboard</Button>
          <Button color="inherit" component={Link} to="/login">Login</Button>
          <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{mt:4}}>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/employee" element={<EmployeeDashboard/>} />
          <Route path="/reviewer" element={<ReviewerDashboard/>} />
          <Route path="/approver" element={<ApproverDashboard/>} />
          <Route path="/admin" element={<AdminDashboard/>} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
