import React, { useState } from "react";
import "./maker.css";
import { useNavigate } from "react-router-dom";
import logo from "../image/logo.png";
import { motion } from "framer-motion";
import mindgram from "../image/mindgram.png";

function Maker() {
  const [rightPanel, setRightPanel] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="maker-wrap">
      <header className="maker-topbar">
        <div className="maker-left">
          <div className="maker-logo">
            <a href="/home">
              <img src={logo} alt="MindGram" />
            </a>
          </div>
          <div className="maker-search">
            <input placeholder="공개 마인드맵 검색하기" />
          </div>
        </div>
        <div className="maker-right">
          <button className="maker-link">커뮤니티</button>
          <button className="maker-link bold">만들기</button>
          <motion.button
            className="maker-join"
            onClick={() => navigate("/signup")}
            whileTap={{ scale: 0.975 }}
            whileHover={{ scale: 1.025 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            가입하기
          </motion.button>
        </div>
      </header>

      <div className="maker-titlebar">
        <input className="maker-title" placeholder="제목을 입력해주세요." />
        <div className="maker-title-actions">
          <button>저장하기</button>
          <button>공유하기</button>
          <button>다운로드</button>
        </div>
      </div>

      <div
        className={`maker-body ${rightPanel ? "panel-right" : "panel-left"}`}
      >
        {!rightPanel && (
          <aside className="maker-side solid">
            <div className="maker-side-header">
              <img src={mindgram} alt="" />
              <div>완료되었습니다!</div>
            </div>
            <div className="maker-card">
              <div className="maker-card-title">아이디어 개요</div>
              <div className="maker-card-box"></div>
            </div>
            <div className="maker-card">
              <div className="maker-card-title">연관 키워드</div>
              <div className="maker-card-box tall"></div>
            </div>
            <div className="maker-card">
              <div className="maker-card-title">관련 뉴스</div>
              <div className="maker-card-box light"></div>
            </div>
            <motion.button
              className="maker-random"
              whileTap={{ scale: 0.975 }}
              whileHover={{ scale: 1.025 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              랜덤 아이디어
            </motion.button>
          </aside>
        )}

        <main className="maker-canvas">
          {rightPanel && (
            <div className="maker-float-toolbar">
              <button onClick={() => setRightPanel(false)} aria-label="포인터">
                ▸
              </button>
              <button aria-label="노드">◻</button>
              <button aria-label="텍스트">⌨</button>
              <button aria-label="기타">⋯</button>
            </div>
          )}

          <div className="maker-context">
            <div>복사하기</div>
            <div>오려두기</div>
            <div>붙여넣기</div>
            <div>같은 노드으로 묶기</div>
            <div>노드에서 제외하기</div>
            <div>잠금/잠금해제</div>
            <div>새로운 노드 시작</div>
          </div>

          <div className="maker-bottom-toolbar">
            <button onClick={() => setRightPanel(false)}>+</button>
            <button className="dot"></button>
            <button>B</button>
            <button>↔</button>
            <div className="value">56</div>
            <button>↕</button>
            <button>⋮</button>
          </div>

          <div className="maker-zoom">
            <button>−</button>
            <div className="zoom-box">100</div>
            <button>＋</button>
          </div>
        </main>

        {rightPanel && (
          <aside className="maker-side">
            <div className="maker-side-header">
              <img src={mindgram} alt="" />
              <div>완료되었습니다!</div>
            </div>
            <div className="maker-card">
              <div className="maker-card-title">아이디어 개요</div>
              <div className="maker-card-box"></div>
            </div>
            <div className="maker-card">
              <div className="maker-card-title">연관 키워드</div>
              <div className="maker-card-box tall"></div>
            </div>
            <div className="maker-card">
              <div className="maker-card-title">관련 뉴스</div>
              <div className="maker-card-box light"></div>
            </div>
            <motion.button
              className="maker-random"
              whileTap={{ scale: 0.975 }}
              whileHover={{ scale: 1.025 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              랜덤 아이디어
            </motion.button>
          </aside>
        )}
      </div>
    </div>
  );
}

export default Maker;
