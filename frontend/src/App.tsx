import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./Signup/Signup";
import Home from "./Home/Home";
import Login from "./Login/Login";
import Maker from "./maker/maker";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Maker" element={<Maker />} />
    </Routes>
  );
}

export default App;
