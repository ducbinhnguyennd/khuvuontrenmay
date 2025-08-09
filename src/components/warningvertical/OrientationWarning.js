import React, { useState, useEffect } from 'react';
import './OrientationWarning.css';

const OrientationWarning = () => {
  const [isPortrait, setIsPortrait] = useState(false);

  const checkOrientation = () => {
    if (window.matchMedia("(orientation: portrait)").matches) {
      setIsPortrait(true);
    } else {
      setIsPortrait(false);
    }
  };

  useEffect(() => {
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);
    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  if (!isPortrait) return null;

  return (
    <div className="orientation-warning">
      <div className="message">
        🔄 Vui lòng xoay điện thoại ngang để chơi game!
      </div>
    </div>
  );
};

export default OrientationWarning;
