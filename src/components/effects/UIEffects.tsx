import React, { useEffect } from "react";

const UIEffects = () => {
  useEffect(() => {
    // Optimization: Use passive event listeners for improved performance
    const onMouseMove = () => {
    };

    const onMouseEnter = () => {};
    const onMouseLeave = () => {};

    const onMouseOver = () => {
    };

    // Add events with passive option for better performance
    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseover", onMouseOver, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseover", onMouseOver);
    };
  }, []);

  return (
    <style>
      {`
      /* Simplified gradient background with less animation complexity */
      body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(-45deg, #240805, #1A1F2C, #000);
        background-size: 300% 300%;
        z-index: -1;
        animation: gradientBG 20s ease infinite; /* Increased duration for less CPU usage */
        opacity: 0.3;
      }
      
      @keyframes gradientBG {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      /* Simplified gradient text for headings with less complex animation */
      h1, h2 {
        background-image: linear-gradient(
          90deg,
          #E34234, #FFE29F
        );
        background-size: 200% auto;
        background-clip: text;
        text-fill-color: transparent;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shine 10s linear infinite; /* Slowed down animation */
      }
      
      @keyframes shine {
        0% { background-position: 0% center; }
        100% { background-position: 200% center; }
      }
      `}
    </style>
  );
};

export default UIEffects;
