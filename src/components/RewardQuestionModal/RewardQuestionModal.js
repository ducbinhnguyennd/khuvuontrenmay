import React from "react";
import "./RewardQuestionModal.css";

const RewardTapModal = ({ show, onClose, rewardTap, type = "success", message }) => {
  if (!show) return null;

  const isSuccess = type === "success";

  return (
    <div className="reward-overlay" onClick={onClose}>
      <div className="reward-box" onClick={(e) => e.stopPropagation()}>
        {isSuccess ? (
          <>
            <img src="/assets/coinm.png" alt="coin" className="reward-coin" />
            <h2>🎉 Chính xác! 🎉</h2>
            <p>Bạn nhận được <b>{rewardTap}</b> lượt tap</p>
          </>
        ) : (
          <>
            <h2 style={{ color: "red" }}>⚠ Lỗi</h2>
            <p>{message || "Đã xảy ra lỗi"}</p>
          </>
        )}
        <button className="reward-btn" onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

export default RewardTapModal;
