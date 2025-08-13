// src/components/ErrorModal.jsx
import React from "react";
import "./ErrorModal.css";

const ErrorModal = ({ show, onClose, message }) => {
  if (!show) return null;

  return (
    <div className="error-overlay" onClick={onClose}>
      <div className="error-box" onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <button className="error-btn" onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

export default ErrorModal;
