// src/components/Background.js
import React, { useEffect, useState } from 'react';

export default function Background() {
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => {
    setOffsetY(window.scrollY * 0.3);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '889vh',
        backgroundImage: 'url("/assets/background.png")',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center bottom',
        zIndex: -10,
      }}
    />
  );
}
