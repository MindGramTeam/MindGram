import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signin from './Signin';
import Home from './Home';
import Login from './Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/Signin" element={<Signin />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Login" element={<Login />} />
    </Routes>
  );
}

export default App;