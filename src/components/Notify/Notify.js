import React, { useEffect } from "react";
import "./Notify.css";

const Notify = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notify-container ${type}`}>
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
