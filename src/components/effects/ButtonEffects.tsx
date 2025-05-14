
import React, { useEffect } from "react";

const ButtonEffects = () => {
  useEffect(() => {
    const addHoverEffect = (button: Element) => {
      button.addEventListener("mouseenter", () => {
        button.classList.add("hover-effect");
      });
      
      button.addEventListener("mouseleave", () => {
        button.classList.remove("hover-effect");
      });
    };

    // Apply effects to all buttons
    document.querySelectorAll("button").forEach(addHoverEffect);

    return () => {
      // Clean up event listeners
      document.querySelectorAll("button").forEach((button) => {
        button.removeEventListener("mouseenter", () => {});
        button.removeEventListener("mouseleave", () => {});
      });
    };
  }, []);

  return (
    <style>
      {`
      /* Button hover effect */
      button:hover {
        transform: translateY(-1px);
      }
      
      button:active {
        transform: translateY(1px);
      }
      
      .hover-effect {
        box-shadow: 0 0 8px var(--color-primary);
      }
      
      /* Primary button with nice gradient */
      button[class*="variant-default"] {
        background: var(--color-primary);
        color: var(--color-primary-foreground);
        transition: all 0.2s ease;
      }
      
      button[class*="variant-default"]:hover {
        opacity: 0.9;
      }
      `}
    </style>
  );
};

export default ButtonEffects;
