
import React, { useEffect } from "react";

const UIEffects = () => {
  useEffect(() => {
    // We've removed most of the event listeners to simplify and improve performance
    return () => {
      // Cleanup
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
        background: linear-gradient(-45deg, var(--color-background), var(--color-card), var(--color-background));
        background-size: 300% 300%;
        z-index: -1;
        animation: gradientBG 20s ease infinite;
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
          var(--color-primary), 
          var(--color-accent)
        );
        background-size: 200% auto;
        background-clip: text;
        text-fill-color: transparent;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shine 10s linear infinite;
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
