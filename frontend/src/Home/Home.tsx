import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../image/logo.png";
import "./Home.css";
import { motion } from "framer-motion";

function Home() {
  const navigate = useNavigate();
  const date = new Date().toLocaleDateString();
  return (
    <div className="home-wrapper">
      <header className="home-header">
        <div className="logo">
          <img src={logo} />
        </div>
        <input
          type="text"
          className="search"
          placeholder="공개 마인드맵 검색하기"
        />
        <nav className="nav">
          <a href="/community">커뮤니티</a>
          <a href="/maker">만들기</a>
          <motion.button
            className="join-btn"
            onClick={() => navigate("/signup")}
            whileTap={{ scale: 0.975 }}
            whileHover={{ scale: 1.025 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            가입하기
          </motion.button>
        </nav>
      </header>

      <main className="home-main">
        <h1 className="title">아이디어를 연결하고 공유하세요</h1>
        <p className="subtitle">
          AI 기반 마인드맵으로 창의적 사고를 확장하고 다른 사람들과 아이디어를
          나누어보세요
        </p>
        <motion.button
          className="start-btn"
          whileTap={{ scale: 0.975 }}
          whileHover={{ scale: 1.025 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          지금 시작하기
        </motion.button>

        <input
          type="text"
          className="search-bar"
          placeholder="공개 마인드맵 검색하기"
        />

        <div className="cards">
          {Array(12)
            .fill(null)
            .map((_, i) => (
              <div className="card" key={i}>
                <div className="card-header">
                  <div className="avatar"></div>
                  <div className="user-info">
                    <span className="nickname">닉네임</span>
                    <span className="userid">@ID_ID</span>
                    <span className="date">{date}</span>
                  </div>
                  <div className="like">♡</div>
                </div>
                <div className="card-body"></div>
              </div>
            ))}
        </div>
      </main>

function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="signup-route-button" onClick={() => navigate("/signup")}>
        회원가입
      </div>
      <div className="login-route-button" onClick={() => navigate("/login")}>
        로그인
      </div>
      <h1>Welcome to MindGram</h1>
      <p>AI 기반 마인드맵 서비스에 오신 것을 환영합니다!</p>
      <p>서비스를 이용하시려면 로그인 또는 회원가입을 해주세요.</p>
    </div>
  );
}

export default Home;
