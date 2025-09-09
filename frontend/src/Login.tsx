import React from 'react';
import './style/Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    return (
        <div className="wrapper">
        <header className="header">
            <img src="https://github.com/MindGramTeam/MindGram/blob/main/logo-3.png?raw=true" alt="MindGram" className="logo" />
        </header>
        <main className="card">
            <img src="https://avatars.githubusercontent.com/u/223702515?s=400&u=b61cfb5c59f254e26b2cbdf138faec5186d0edda&v=4" alt="icon" className="star" />
            <h1 className="title">로그인</h1>
            <p className="desc">
            AI 기반 마인드맵 서비스 MindGram에 오신 걸 환영합니다!
            <br />
            모든 서비스 이용을 위해 먼저 로그인해주세요
            </p>
            <form className="form">
            <input type="text" placeholder="이메일 또는 아이디" className="input" />
            <input type="password" placeholder="비밀번호" className="input" />
            <button type="submit" className="button">로그인</button>
            </form>
            <div className="login" onClick={() => navigate('/signin')}>또는 회원가입</div>
        </main>
        <div className="bottom-link">아이디/비번 찾기</div>
        </div>
    );
}

export default Login;