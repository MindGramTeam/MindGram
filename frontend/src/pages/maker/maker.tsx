import React, { useState, useEffect, useRef } from "react";
import "./maker.css";
import { useNavigate } from "react-router-dom";
import logo from "@/image/logo.png";
import { motion } from "framer-motion";
import mindgram from "@/image/mindgram.png";
import Draggable from "react-draggable";

interface Node {
  id: number;
  x: number;
  y: number;
  text: string;
}

function Maker() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [rightPanel, setRightPanel] = useState(true);
  const navigate = useNavigate();
  const [contextNode, setContextNode] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const activeNodeEl = useRef<HTMLElement | null>(null);
  const [editingNode, setEditingNode] = useState<number | null>(null);

  useEffect(() => {
    setNodes([{ id: 1, x: 400, y: 300, text: "아이디어 시작" }]);
  }, []);

  const handleExpand = async (id: number) => {
    const res = await fetch("http://localhost:8000/expand", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: nodes.find((n) => n.id === id)?.text }),
    });
    const data = await res.json();

    setNodes((prev) => [
      ...prev,
      {
        id: Date.now(),
        x: prev.find((n) => n.id === id)!.x + 150,
        y: prev.find((n) => n.id === id)!.y,
        text: data.suggestion,
      },
    ]);
  };

  const handleAction = (label: string) => {
    if (contextNode == null) return;
    const node = nodes.find((n) => n.id === contextNode);
    if (!node) return;

    if (label === "복사하기") {
      setNodes((prev) => [
        ...prev,
        { ...node, id: Date.now(), x: node.x + 40, y: node.y + 40 },
      ]);
      setContextNode(null);
      return;
    }

    if (label === "같은 노드으로 묶기") {
      alert("선택된 노드를 묶었습니다. (UI 반영은 다음 단계에서 적용)");
      setContextNode(null);
      return;
    }

    if (label === "노드에서 제외하기") {
      setNodes((prev) => prev.filter((n) => n.id !== node.id));
      setContextNode(null);
      return;
    }

    if (label === "잠금/잠금해제") {
      alert("아직 구현 안됌");
      setContextNode(null);
      return;
    }

    if (label === "새로운 노드 시작") {
      setNodes((prev) => [
        ...prev,
        { id: Date.now(), x: node.x + 120, y: node.y, text: "새 노드" },
      ]);
      setContextNode(null);
      return;
    }
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const nodeEl = target.closest(".node") as HTMLElement | null;
      const menuEl = target.closest(".maker-context") as HTMLElement | null;

      if (nodeEl) {
        activeNodeEl.current = nodeEl;
        return;
      }
      if (!menuEl) {
        setContextNode(null);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    const menu = document.querySelector(".maker-context") as HTMLElement | null;
    const canvas = document.querySelector(
      ".maker-canvas"
    ) as HTMLElement | null;
    if (!menu || !canvas) return;

    if (contextNode == null) {
      menu.style.display = "none";
      return;
    }

    menu.style.display = "block";

    const nodeEl = activeNodeEl.current;
    if (!nodeEl) {
      menu.style.left = "50%";
      menu.style.top = "50%";
      menu.style.transform = "translate(-50%, -50%)";
      return;
    }
    const nodeRect = nodeEl.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    const left = nodeRect.left - canvasRect.left + nodeRect.width + 8;
    const top = nodeRect.top - canvasRect.top + nodeRect.height + 8;

    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    menu.style.transform = "translate(0, 0)";
  }, [contextNode, nodes]);

  useEffect(() => {
    const menu = document.querySelector(".maker-context");
    if (!menu) return;

    const items = Array.from(
      menu.querySelectorAll(":scope > div")
    ) as HTMLElement[];

    const handlers: Array<[(e: Event) => void, HTMLElement]> = [];

    items.forEach((el) => {
      const label = (el.textContent || "").trim();
      const h = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        handleAction(label);
      };
      el.addEventListener("click", h);
      handlers.push([h, el]);
    });

    return () => {
      handlers.forEach(([h, el]) => el.removeEventListener("click", h));
    };
  }, [contextNode, nodes]);

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
          <motion.div
            className="canvas-inner"
            style={{ scale }}
            transition={{ duration: 0.2 }}
          >
            {nodes.map((node) => (
              <Draggable
                key={node.id}
                defaultPosition={{ x: node.x, y: node.y }}
                onStop={(e, data) => {
                  setNodes((prev) =>
                    prev.map((n) =>
                      n.id === node.id ? { ...n, x: data.x, y: data.y } : n
                    )
                  );
                }}
              >
                <div
                  className="node"
                  onClick={() => {
                    if (editingNode == null) setContextNode(node.id);
                  }}
                  onDoubleClick={() => setEditingNode(node.id)}
                >
                  {editingNode === node.id ? (
                    <input
                      autoFocus
                      defaultValue={node.text}
                      onBlur={(e) => {
                        setNodes((prev) =>
                          prev.map((n) =>
                            n.id === node.id
                              ? { ...n, text: e.target.value }
                              : n
                          )
                        );
                        setEditingNode(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setNodes((prev) =>
                            prev.map((n) =>
                              n.id === node.id
                                ? {
                                    ...n,
                                    text: (e.target as HTMLInputElement).value,
                                  }
                                : n
                            )
                          );
                          setEditingNode(null);
                        }
                      }}
                    />
                  ) : (
                    <>
                      {node.text}
                      {contextNode === node.id && (
                        <div className="context-menu">
                          <motion.button
                            onClick={() => handleExpand(node.id)}
                            className="maker-random"
                            whileTap={{ scale: 0.975 }}
                            whileHover={{ scale: 1.025 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 20,
                            }}
                          >
                            추천
                          </motion.button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Draggable>
            ))}
          </motion.div>

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
            <div>같은 노드으로 묶기</div>
            <div>노드 삭제</div>
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
            <button onClick={() => setScale((s) => Math.max(0.2, s - 0.1))}>
              −
            </button>
            <div className="zoom-box">{Math.round(scale * 100)}%</div>
            <button onClick={() => setScale((s) => s + 0.1)}>＋</button>
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
