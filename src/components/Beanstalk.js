import React from 'react';

export default function Beanstalk() {
  return (
    <div
      style={{
        backgroundImage: `url("assets/caydau.png")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        height: '150vh', // cây rất cao
        width: '100%',
        position: 'absolute',
        top: '100vh', // bắt đầu sau mặt đất
        zIndex: 1,
      }}
    ></div>
  );
}
