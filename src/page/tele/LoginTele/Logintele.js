import React from "react";
import "./LoginTele.css";

export default function LoginTele() {
  return (
    <div className="login-container">
      {/* Logo */}
      <img
        src="/logo.png" // thay đường dẫn logo
        alt="Khu Vườn Trên Mây"
        className="logo"
      />

      {/* Form */}
      <div className="form">
        <div className="input-group">
          <span className="icon">👤</span>
          <input type="text" placeholder="Tên đăng nhập" />
        </div>
        <div className="input-group">
          <span className="icon">🔒</span>
          <input
            type="password"
            placeholder="Mật khẩu"
          />
        </div>

        {/* Buttons */}
        <button className="btn-login">ĐĂNG NHẬP</button>
        <button className="btn-register">ĐĂNG KÝ</button>
      </div>
    </div>
  );
}
