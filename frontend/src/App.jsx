import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
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
  const appRef = useRef();

  useEffect(() => {
    if (!appRef.current) return;
    // Animate main container fade-in on mount
    gsap.fromTo(appRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });

    // Animate all .crud-container and .dashboard-section on scroll
    gsap.utils.toArray('.crud-container, .dashboard-section').forEach((el) => {
      gsap.fromTo(el, { opacity: 0, y: 60 }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    });
  }, []);

  return (
    <div ref={appRef} className="app-gsap-animated">
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
    </div>
  );
}

export default App;
