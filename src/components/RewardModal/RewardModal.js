// src/components/RewardModal.jsx
import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import "./RewardModal.css";

const RewardModal = ({ show, onClose, amount }) => {
  useEffect(() => {
    if (show) {
      // Bắn pháo hoa nhiều đợt
      const duration = 2 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min, max) =>
        Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // Bắn 2 hướng
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="reward-modal-overlay" onClick={onClose}>
      <div className="reward-modal" onClick={(e) => e.stopPropagation()}>
        <img src="/assets/coinm.png" alt="coin" className="reward-coin" />
        <h2 style={{ margin: "10px" }}>Bạn nhận được {amount} MSKC</h2>
        <p>Tiếp tục tap để nhận thêm phần thưởng nhé!</p>
        <button className="reward-btn" onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

export default RewardModal;
