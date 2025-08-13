import React from 'react';
import './i18n';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoute';
import Participants from './Participants';
import Formateurs from './Formateurs';
import Cycles from './Cycles';
import Navbar from './Navbar';
import './App.css';

function ProtectedWithNavbar({ children }) {
  return (
    <ProtectedRoute>
      <Navbar />
      {children}
    </ProtectedRoute>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedWithNavbar><Dashboard /></ProtectedWithNavbar>} />
        <Route path="/participants" element={<ProtectedWithNavbar><Participants /></ProtectedWithNavbar>} />
        <Route path="/formateurs" element={<ProtectedWithNavbar><Formateurs /></ProtectedWithNavbar>} />
        <Route path="/cycles" element={<ProtectedWithNavbar><Cycles /></ProtectedWithNavbar>} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/404" element={<h1>f</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
