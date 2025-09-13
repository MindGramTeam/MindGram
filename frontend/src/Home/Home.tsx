import React from "react";
import { useNavigate } from "react-router-dom";

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
