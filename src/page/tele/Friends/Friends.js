import React, { useEffect, useRef, useState } from "react";
import { useUser } from "../../../components/UserContext";
import { useNavigate } from "react-router-dom";
import "./Friends.css";
import { getApiUrl } from "../../../api";

function Friends() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const data_user = JSON.parse(localStorage.getItem("user"));
  const hasFetched = useRef(false);
  const { user, fetchUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (data_user && !hasFetched.current) {
      fetchUser(data_user._id).then(() => {
        hasFetched.current = true;
      });
    }
  }, [data_user]);

  useEffect(() => {
    if (user?._id) {
      fetchFriends();
    }
  }, [user?._id]);

  const fetchFriends = async () => {
    try {
      const res = await fetch(
        `${getApiUrl("backend")}/danhsachbanbetele/${user._id}`
      );
      const data = await res.json();
      setFriends(data);
    } catch (err) {
      console.error("Lỗi lấy danh sách bạn bè:", err);
    } finally {
      setLoading(false);
    }
  };
  const copyLink = () => {
    if (user?.linkgioithieu) {
      navigator.clipboard.writeText(user.linkgioithieu).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };
  return (
    <div className="home-container">
      <button className="btn-home" onClick={() => navigate("/")}>
        Trang chủ
      </button>

      <div className="section-title">Link giới thiệu</div>
      <div className="boxtele" onClick={copyLink}>
        {user?.linkgioithieu || "Đang tải..."}
      </div>
      {copied && <div className="copy-toast">✅ Đã copy link!</div>}
      <div className="section-title">Danh sách bạn bè đã mời</div>
      {loading ? (
        <p className="loading-text">Đang tải...</p>
      ) : friends.length > 0 ? (
        <ul className="friends-list">
          {friends.map((f) => (
            <li key={f._id} className="boxtele friend-item">
              <b>{f.name}</b> <br />
              <span>ID Tele: {f.idtele}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-friends">Không có bạn bè nào.</p>
      )}
    </div>
  );
}

export default Friends;
