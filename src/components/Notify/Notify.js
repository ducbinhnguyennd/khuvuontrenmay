import React, { useEffect, useState } from "react";
import "./Notify.css";

const Notify = ({ message, type = "success", onClose }) => {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setClosing(true); // bắt đầu fade out
    }, 2500); // fade out trước khi đóng

    const removeTimer = setTimeout(() => {
      onClose(); // gọi đóng thật sự
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [onClose]);

  return (
    <div className={`notify-container ${type} ${closing ? "fade-out" : "fade-in"}`}>
      <div className="notify-icon">
        {type === "success" && "✅"}
        {type === "error" && "❌"}
        {type === "warning" && "⚠️"}
        {type === "info" && "ℹ️"}
      </div>
      <div className="notify-message">{message}</div>
    </div>
  );
};

export default Notify;
