import React, { useContext, useEffect, useRef, useState } from "react";
import "./HomeTele.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../components/UserContext";
import RewardModal from "../../../components/RewardModal/RewardModal";
import { getApiUrl } from "../../../api";

function Hometele() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const data_user = JSON.parse(localStorage.getItem("user"));
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [supplyData, setSupplyData] = useState(null);
  const { user, fetchUser } = useUser();
  useEffect(() => {
    if (data_user && !hasFetched.current) {
      fetchUser(data_user._id);
      hasFetched.current = true;
    }
  }, [data_user]);
  useEffect(() => {
    fetchSupplyData();
  }, []);
  const loadNhiemvu = async () => {
    try {
      const res = await fetch(`${getApiUrl("backend")}/getnhiemvu/${user._id}`);
      if (!res.ok) {
        throw new Error(`Lỗi HTTP: ${res.status}`);
      }
      const data = await res.json();
      console.log("Dữ liệu nhiệm vụ:", data);
      setTasks(data);
    } catch (err) {
      console.error("Lỗi khi lấy nhiệm vụ:", err);
    }
  };
  const fetchSupplyData = async () => {
    try {
      const res = await fetch(`${getApiUrl("backend")}/gettongcung`);
      if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);
      const data = await res.json();
      setSupplyData(data);
    } catch (err) {
      console.error("Lỗi khi lấy tổng cung:", err);
    }
  };
  const handleLamNhiemVu = async (idNhiemVu) => {
    if (!user?._id) {
      console.error("Người dùng chưa đăng nhập");
      return;
    }
    try {
      await fetch(
        `${getApiUrl("backend")}/postlamnhiemvu/${idNhiemVu}/${user._id}`,
        {
          method: "POST",
        }
      );
      loadNhiemvu(user._id);
      fetchUser(user._id);
      fetchSupplyData();
    } catch (err) {
      console.error("Lỗi làm nhiệm vụ:", err);
    }
  };
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  const tap = async () => {
    if (!user?._id) {
      console.error("Người dùng chưa đăng nhập");
      return;
    }
    try {
      const res = await fetch(`${getApiUrl("backend")}/tapcay/${user._id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data?.mskcNhanDuoc) {
        setRewardAmount(data.mskcNhanDuoc);
        setShowRewardModal(true);
      }
      fetchUser(user._id);
      fetchSupplyData();
    } catch (err) {
      console.error("Lỗi tap cây:", err);
    }
  };

  const getIconByType = (type) => {
    switch (type) {
      case "youtube":
        return "/assets/tele/youtube.png";
      case "telegram":
        return "/assets/tele/telegram.png";
      case "tiktok":
        return "/assets/tele/tiktok.png";
      case "facebook":
        return "/assets/tele/fb.png";
      case "instagram":
        return "/assets/tele/instagram.png";
      case "threads":
        return "/assets/tele/threads.png";
      case "twitter":
        return "/assets/tele/twitter.png";
      default:
        return "/assets/coinm.png";
    }
  };

  useEffect(() => {
    if (user?._id) {
      loadNhiemvu(user._id);
    }
  }, [user]);

  return (
    <div className="home-container">
      <div className="coin-display">
        <img src="/assets/coinm.png" alt="coin" className="coin-icon" />
        <span className="coin-amount">{user?.mskc?.toLocaleString() || 0}</span>
      </div>
      <div className="friends-display" onClick={() => navigate('/friends')}>
        <img src="/assets/tele/friends.png" alt="coin" className="friends-icon" />
      </div>
      <span className="coin-amount">{user?.username}</span>
      {/* <div className='logout' onClick={logout}>
        <img src='/assets/coinm.png' alt='coin' className='coin-icon' />
        <span className='coin-amount'>Đăng xuất</span>
      </div> */}
      <div className="logout" onClick={logout}>
        <img src="/assets/tele/doixu.png" alt="coin" className="coin-icon" />
        <span className="coin-amount">Đổi xu</span>
      </div>
      <img
        src="/assets/logo.png"
        alt="Khu Vườn Trên Mây"
        className="logo-hometl"
      />
      <img src="/assets/cay2.png" alt="tree" className="tree" />

      <button className="btn-tap" onClick={tap}>
        TAP TO EARN
      </button>
      <div className="tap-count">
        Bạn còn <span className="highlight">{user?.luottap || 0}</span> lượt tap
      </div>

      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div
            key={task._id}
            className="boxtele"
            onClick={() => {
              handleLamNhiemVu(task._id);
              if (task.link) {
                window.open(task.link, "_blank");
              }
            }}
          >
            <img
              src={getIconByType(task.type)}
              alt={task.type}
              className="task-icon"
            />
            <span className="task-title">{task.diengiai}</span>
            <div className="nv">
              <span className="reward">+{task.luottap}</span>{" "}
              <img src="/assets/coinm.png" alt="coin" className="coin-icon" />
            </div>
          </div>
        ))
      ) : (
        <p>Không có nhiệm vụ nào</p>
      )}

      <div onClick={() => navigate("/questions")} className="boxtele">
        <span className="task-title">
          Trả lời câu hỏi để nhận thêm lượt tap
        </span>
        <span
          style={{
            marginLeft: "10px",
            backgroundColor: "#E5B25D",
            borderRadius: "8px",
            padding: "5px 12px",
            fontWeight: "bold",
            color: "#5B3B0A",
            fontSize: "14px",
          }}
        >
          Đi vào
        </span>
      </div>
      {supplyData && (
        <div className="bottom-bar">
          <div>
            Tổng cung: <b>{supplyData.tongcung.toLocaleString()}</b>
          </div>
          <div>
            Đã phát hành:{" "}
            <b>{supplyData.tongcungdaphathanh.toLocaleString()}</b>
          </div>
          <div>
            Còn lại: <b>{supplyData.tongcungconlai.toLocaleString()}</b>
          </div>
        </div>
      )}
      <RewardModal
        show={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        amount={rewardAmount}
      />
    </div>
  );
}

export default Hometele;
