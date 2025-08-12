import React, { useEffect, useState } from "react";
import "./HomeTele.css";
import { useNavigate } from "react-router-dom";
function Hometele() {
  const [tasks, setTasks] = useState([]);
  const [username, setUsername] = useState("");
  const [mskc, setMskc] = useState(0);
  const [luottap, setLuottap] = useState(0);
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const loadUserData = () => {
    if (storedUser) {
      setUsername(storedUser.username);
      setMskc(storedUser.mskc);
      setLuottap(storedUser.luottap);

      fetch(`http://localhost:3200/getnhiemvu/${storedUser._id}`)
        .then((res) => res.json())
        .then((data) => setTasks(data))
        .catch((err) => console.error("Lỗi khi lấy nhiệm vụ:", err));
    }
  };
  useEffect(() => {
    loadUserData();
  }, []);
  const handleLamNhiemVu = async (idNhiemVu) => {
    try {
      await fetch(
        `http://localhost:3200/postlamnhiemvu/${idNhiemVu}/${storedUser._id}`,
        {
          method: "POST",
        }
      );
      loadUserData();
    } catch (err) {
      console.error("Lỗi làm nhiệm vụ:", err);
    }
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
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

  return (
    <div className="home-container">
      {/* Số tiền */}
      <div className="coin-display">
        <img src="/assets/coinm.png" alt="coin" className="coin-icon" />
        <span className="coin-amount">{mskc.toLocaleString()}</span>
      </div>
      <div className="logout" onClick={handleLogout}>
        <img src="/assets/coinm.png" alt="coin" className="coin-icon" />
        <span className="coin-amount">Đăng xuất</span>
      </div>
      {/* Logo */}
      <img
        src="/assets/logo.png"
        alt="Khu Vườn Trên Mây"
        className="logo-hometl"
      />

      {/* Cây */}
      <img src="/assets/cay2.png" alt="tree" className="tree" />

      {/* Nút tap */}
      <button className="btn-tap">TAP TO EARN</button>
      <div className="tap-count">
        Bạn còn <span className="highlight">{luottap}</span> lượt tap
      </div>

      {/* Danh sách nhiệm vụ */}
      {tasks.map((task) => (
        <div
          key={task._id}
          className="task"
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
          <span>{task.diengiai}</span>
          <span className="reward">+{task.luottap}</span>
        </div>
      ))}
    </div>
  );
}

export default Hometele;
