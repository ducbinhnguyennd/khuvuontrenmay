import React from "react";

export default function Clouds() {
  const totalFloors = 18;
  const floorHeight = 400; // px – điều chỉnh cho phù hợp với viewport

  return (
    <div
      style={{
        height: `${totalFloors * floorHeight}px`,
        width: "100%",
        position: "relative",
      }}
    >
      {Array.from({ length: totalFloors }).map((_, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            bottom: `${index * floorHeight}px`,
            width: "100%",
            height: `${floorHeight}px`,
           backgroundImage: `url("assets/may.gif")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
        >
          <div style={{ fontSize: 24, textAlign: "center" }}>
            Tầng {index + 1}
          </div>
        </div>
      ))}
    </div>
  );
}
