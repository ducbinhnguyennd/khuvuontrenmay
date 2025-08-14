import React, { useState } from "react";
import "./ExchangeCoinModal.css";

function ExchangeCoinModal({ show, onClose, onConfirm }) {
  const [amount, setAmount] = useState("");

  if (!show) return null;

  return (
    <div className="modal-overlay-exchange">
      <div className="modal-content-exchange">
        <h2 className="modal-title-exchange">Đổi xu</h2>
        <input
          type="number"
          placeholder="Nhập số xu muốn đổi"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="modal-input-exchange"
        />
        <div className="modal-buttons-exchange">
          <button onClick={onClose} className="btn-cancel-exchange">Hủy</button>
          <button
            onClick={() => {
              if (!amount || amount <= 0) {
                alert("Vui lòng nhập số xu hợp lệ!");
                return;
              }
              onConfirm(Number(amount));
              setAmount("");
            }}
            className="btn-confirm-exchange"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExchangeCoinModal;
