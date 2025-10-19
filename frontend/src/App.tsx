import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "@/pages/auth/signup/Signup";
import Home from "@/pages/home/Home";
import Login from "@/pages/auth/login/Login";
import Maker from "@/pages/maker/maker";

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
