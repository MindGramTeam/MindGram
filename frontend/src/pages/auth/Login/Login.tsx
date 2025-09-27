import React from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import logo from "@/image/logo.png";
import mindgram from "@/image/mindgram.png";
import "@/style.css";
import { motion } from "framer-motion";

function Login() {
  const navigate = useNavigate();
  return (
    <div className="wrapper">
      <header className="header">
        <img src={logo} alt="MindGram" className="logo" />
      </header>
      <main className="card">
        <img src={mindgram} alt="icon" className="mindgram" />
        <h1 className="title">로그인</h1>
        <p className="desc">
          AI 기반 마인드맵 서비스 MindGram에 오신 걸 환영합니다!
          <br />
          모든 서비스 이용을 위해 먼저 로그인해주세요
        </p>
        <form className="form-input">
          <input
            type="text"
            placeholder="이메일 또는 아이디"
            className="id-input"
          />
          <input type="password" placeholder="비밀번호" className="id-input" />
          <motion.button
            type="submit"
            className="id-button"
            whileTap={{ scale: 0.975 }}
            whileHover={{ scale: 1.025 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            로그인
          </motion.button>
        </form>
        <div className="login" onClick={() => navigate("/signup")}>
          또는 회원가입
        </div>
      </main>
      <div className="bottom-link">아이디/비번 찾기</div>
    </div>
  );
}

export default Login;
