import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginTele.css";
import { getApiUrl } from "../../../api";

function LoginTele() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      const res = await fetch(`${getApiUrl('backend')}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            navigate("/");
          } else {
            alert("Sai tài khoản hoặc mật khẩu");
          }
        });
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối server!");
    }
  };

  return (
    <div className="login-container">
      <img src="/assets/logo.png" alt="Khu Vườn Trên Mây" className="logo" />

      <div className="form">
        <div className="input-group">
          <span className="icon">👤</span>
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-group">
          <span className="icon">🔒</span>
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn-login" onClick={handleLogin}>
          ĐĂNG NHẬP
        </button>
        <button className="btn-register" onClick={() => navigate("/register")}>
          ĐĂNG KÝ
        </button>
      </div>
    </div>
  );
}

export default LoginTele;
