import React from "react";
import "./Loading.css";

function Loading() {
  return (
    <div className="loading-overlay">
      <img src="/assets/loadinggif.gif" alt="loading..." className="loading-gif" />
    </div>
  );
}

export default Loading;
