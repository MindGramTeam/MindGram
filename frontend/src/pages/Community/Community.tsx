import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Community.css";

type SuggestedUser = {
  id: string;
  name: string;
  handle: string;
  note: string;
};
/** 팔로워 추천 유저 (나중에 연결할 예정) */
const suggestedUsers: SuggestedUser[] = [
  { id: "1", name: "이유정", handle: "@flowercat07", note: "님을 팔로우를 원합니다" },
  { id: "2", name: "이한", handle: "@sevenblue22", note: "님을 팔로우를 원합니다" },
  { id: "3", name: "김한솔", handle: "@shinerose03", note: "님을 팔로우를 원합니다" },
  { id: "4", name: "나은", handle: "@watermeadow", note: "님을 팔로우를 원합니다" },
];
/** 좋아요 버튼 */
const LikeButton: React.FC<{ index: number }> = ({ index }) => {
  const [liked, setLiked] = useState(false);
  return (
    <button
      className={`like ${liked ? "liked" : ""}`}
      aria-label="like"
      onClick={() => setLiked(v => !v)}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <path d="M12.1 8.64l-.1.1-.11-.11C10.14 6.83 7.1 7.24 5.88 9.36c-.92 1.6-.5 3.69.93 4.9L12 19l5.19-4.73c1.43-1.21 1.85-3.3.93-4.9-1.22-2.12-4.26-2.53-5.92-.73z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
};

const Community: React.FC = () => {
  return (
    <div className="comm-wrap">
      <aside className="comm-side">

        <div className="comm-profile">
          <div className="avatar" />
          <div className="profile-text">
            <div className="name">대충유</div>
            <div className="handle">@mindgram007</div>
            <div className="status">님은 창의적으로 생각중</div>
          </div>
        </div>

        <div className="comm-suggest-title">팔로워 추천</div>
        <div className="comm-suggest-list">
          {suggestedUsers.map((u) => (
            <div className="suggest-item" key={u.id}>
              <div className="avatar small" />
              <div className="info">
                <div className="top">
                  <span className="name">{u.name}</span>
                  <span className="handle">{u.handle}</span>
                </div>
                <div className="note">{u.note}</div>
              </div>
              <motion.button
                className="follow-btn"
                whileTap={{ scale: 0.975 }}
                whileHover={{ scale: 1.025 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                + 팔로우
              </motion.button>
            </div>
          ))}
        </div>
      </aside>

      <main className="comm-main">
        {/** local demo like state */}
        {/** different page instance so separate state */}
        
        <div className="post-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div className="card" key={i}>
              <div className="card-header">
                <div className="avatar"></div>
                <div className="user-info">
                  <span className="nickname">닉네임</span>
                  <span className="userid">@ID_ID</span>
                  <span className="date">Tue Aug 6 6:33 PM</span>
                </div>
                <LikeButton index={i} />
              </div>
              <div className="card-body"></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Community;


