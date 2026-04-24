import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import SalonList from './screens/SalonList';
import SalonDetail from './screens/SalonDetail';
import Booking from './screens/Booking';
import Dashboard from './screens/Dashboard';
import Register from './screens/Register';
import Login from './screens/Login';
import SalonSetup from './screens/SalonSetup';
import Landing from './screens/Landing';
import Profile from './screens/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/salons" element={<SalonList />} />
        <Route path="/salon/:id" element={<SalonDetail />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setup" element={<SalonSetup />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;