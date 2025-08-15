import React, { useEffect, useRef, useState } from "react";
import "./HomeTele.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../components/UserContext";
import RewardModal from "../../../components/RewardModal/RewardModal";
import { getApiUrl } from "../../../api";
import Loading from "../../../components/Loading/Loading";
import ExchangeCoinModal from "../../../components/DoiXu/ExchangeCoinModal";
import Notify from "../../../components/Notify/Notify";

function Hometele() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const data_user = JSON.parse(localStorage.getItem("user"));
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [supplyData, setSupplyData] = useState(null);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const { user, fetchUser } = useUser();
  const bgmRef = useRef(null);
  const [notify, setNotify] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const showNotify = (message, type = "success") => {
    setNotify({ show: true, message, type });
  };
  useEffect(() => {
    if (data_user && !hasFetched.current) {
      fetchUser(data_user._id);
      hasFetched.current = true;
    }
  }, [data_user]);

  useEffect(() => {
    fetchSupplyData();
  }, []);

  const stopnhac = () => {
    if (bgmRef.current) {
      bgmRef.current.pause();
    }
  };

  const playBgm = () => {
    if (bgmRef.current) {
      bgmRef.current.volume = 0.1;
      bgmRef.current.play().catch((err) => {
        console.log("Không thể phát nhạc nền:", err);
      });
    }
  };

  useEffect(() => {
    playBgm();

    const unlockAudio = () => {
      playBgm();
      document.removeEventListener("click", unlockAudio);
    };
    document.addEventListener("click", unlockAudio);

    return () => {
      document.removeEventListener("click", unlockAudio);
    };
  }, []);

  const loadNhiemvu = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${getApiUrl("backend")}/getnhiemvu/${user._id}`);
      if (!res.ok) {
        throw new Error(`Lỗi HTTP: ${res.status}`);
      }
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Lỗi khi lấy nhiệm vụ:", err);
    } finally {
      setLoading(false);
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
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  const tap = async () => {
    if (!user?._id) {
      showNotify("Bạn chưa đăng nhập!", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${getApiUrl("backend")}/tapcay/${user._id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data?.mskcNhanDuoc) {
        setRewardAmount(data.mskcNhanDuoc);
        setShowRewardModal(true);
        stopnhac();
      }
      fetchUser(user._id);
      fetchSupplyData();
    } catch (err) {
      console.error("Lỗi tap cây:", err);
    } finally {
      setLoading(false);
    }
  };
  const doiXu = async (amount) => {
    if (!user?._id) {
      alert("Bạn chưa đăng nhập!");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${getApiUrl("backend")}/doicoin/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mskc: amount }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotify("Đổi xu thành công!", "success");
        fetchUser(user._id);
      } else {
        alert(data.message || "Đổi xu thất bại!");
      }
    } catch (err) {
      console.error("Lỗi đổi xu:", err);
      showNotify("Có lỗi khi đổi xu!", "error");
    } finally {
      setLoading(false);
      setShowExchangeModal(false);
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
      {loading && <Loading />}
      <audio ref={bgmRef} src="/assets/soundnen.mp3" preload="auto" loop />

      <div className="coin-display">
        <img src="/assets/coinm.png" alt="coin" className="coin-icon" />
        <span className="coin-amount">{user?.mskc?.toLocaleString() || 0}</span>
      </div>
      <div className="friends-display" onClick={() => navigate("/friends")}>
        <img
          src="/assets/tele/friends.png"
          alt="coin"
          className="friends-icon"
        />
      </div>
      <span className="coin-amount">{user?.username}</span>
      <div style={{ cursor: "pointer" }} onClick={logout}>
        <img src="/assets/coinm.png" alt="coin" />
        <span className="coin-amount">Đăng xuất</span>
      </div>
      <div className="logout" onClick={() => setShowExchangeModal(true)}>
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
            Tổng cung: <br /> <b>{supplyData.tongcung.toLocaleString()}</b>
          </div>
          <div>
            Đã phát hành:
            <br />
            <b>{supplyData.tongcungdaphathanh.toLocaleString()}</b>
          </div>
          {/* <div>
            Còn lại:
            <br /> <b>{supplyData.tongcungconlai.toLocaleString()}</b>
          </div> */}
        </div>
      )}
      <RewardModal
        show={showRewardModal}
        onClose={() => {
          setShowRewardModal(false);
          playBgm();
        }}
        amount={rewardAmount}
      />
      <ExchangeCoinModal
        show={showExchangeModal}
        onClose={() => setShowExchangeModal(false)}
        onConfirm={doiXu}
        mskctocoin={user?.mskctocoin}
      />
      {notify.show && (
        <Notify
          message={notify.message}
          type={notify.type}
          onClose={() => setNotify({ ...notify, show: false })}
        />
      )}
    </div>
  );
}

export default Hometele;
