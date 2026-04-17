import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import SalonList from './screens/SalonList';
import SalonDetail from './screens/SalonDetail';
import Booking from './screens/Booking';
import Dashboard from './screens/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/salons" element={<SalonList />} />
        <Route path="/salon/:id" element={<SalonDetail />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;