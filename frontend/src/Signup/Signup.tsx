import React from "react";
import "../Signup/Signup.css";
import { useNavigate } from "react-router-dom";
import logo from "../image/logo.png";
import mindgram from "../image/mindgram.png";
import "../style.css";
import { motion } from "framer-motion";

function Signup() {
  const navigate = useNavigate();
  return (
    <div className="wrapper">
      <header className="header">
        <img src={logo} alt="MindGram" className="logo" />
      </header>
      <main className="card">
        <img src={mindgram} alt="icon" className="mindgram" />
        <h1 className="title">회원가입</h1>
        <p className="desc">
          AI 기반 마인드맵 서비스 MindGram에 오신 걸 환영합니다!
          <br />
          모든 서비스 이용을 위해 먼저 가입해주세요
        </p>
        <form className="form-input">
          <input type="email" placeholder="이메일" className="input" />
          <input type="text" placeholder="아이디" className="input" />
          <input type="password" placeholder="비밀번호" className="input" />
          <motion.button
            type="submit"
            className="id-button"
            whileTap={{ scale: 0.975 }}
            whileHover={{ scale: 1.025 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            회원가입
          </motion.button>
        </form>
        <div className="login" onClick={() => navigate("/login")}>
          또는 로그인
        </div>
      </main>
    </div>
  );
}

export default Signup;
