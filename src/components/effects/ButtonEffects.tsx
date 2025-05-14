
import React, { useEffect } from "react";

const ButtonEffects = () => {
  useEffect(() => {
    // Add ripple effect to all buttons
    const addRippleToButtons = () => {
      const buttons = document.querySelectorAll('button');
      
      buttons.forEach(button => {
        button.addEventListener('click', createRipple);
      });
    };

    const createRipple = (event: MouseEvent) => {
      const button = event.currentTarget as HTMLElement;
      
      const circle = document.createElement('span');
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;

      // Get button's position
      const rect = button.getBoundingClientRect();
      
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${event.clientX - rect.left - radius}px`;
      circle.style.top = `${event.clientY - rect.top - radius}px`;
      circle.classList.add('ripple');
      
      // Remove existing ripples
      const ripples = button.getElementsByClassName('ripple');
      if (ripples.length > 0) {
        ripples[0].remove();
      }
      
      button.appendChild(circle);
    };

    // Add shadow effect to buttons
    const addShadowToButtons = () => {
      const buttons = document.querySelectorAll('button');
      
      buttons.forEach(button => {
        button.addEventListener('mousemove', updateButtonShadow);
        button.addEventListener('mouseleave', resetButtonShadow);
      });
    };

    const updateButtonShadow = (event: MouseEvent) => {
      const button = event.currentTarget as HTMLElement;
      const rect = button.getBoundingClientRect();
      
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const angleX = (x - centerX) / centerX * 15;
      const angleY = (y - centerY) / centerY * 15;
      
      button.style.boxShadow = `
        ${-angleX}px ${-angleY}px 15px rgba(227, 66, 52, 0.3),
        0 5px 15px rgba(0, 0, 0, 0.1)
      `;
    };

    const resetButtonShadow = (event: MouseEvent) => {
      const button = event.currentTarget as HTMLElement;
      button.style.boxShadow = '';
    };

    addRippleToButtons();
    addShadowToButtons();

    return () => {
      // Clean up event listeners
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        button.removeEventListener('click', createRipple);
        button.removeEventListener('mousemove', updateButtonShadow);
        button.removeEventListener('mouseleave', resetButtonShadow);
      });
    };
  }, []);

  return (
    <style>
      {`
      button {
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
      }
      
      button:hover {
        transform: translateY(-2px);
      }
      
      .ripple {
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        background-image: linear-gradient(to right, rgba(227, 66, 52, 0.7), rgba(246, 215, 148, 0.7));
        animation: ripple 0.8s linear;
        pointer-events: none;
      }
      
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      
      /* Loading animation for buttons */
      .button-loading {
        position: relative;
        pointer-events: none;
      }
      
      .button-loading::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.2),
          transparent
        );
        animation: loading-pulse 1.5s ease-in-out infinite;
      }
      
      @keyframes loading-pulse {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      /* Page transition effect */
      .page-transition-enter {
        opacity: 0;
        transform: translateY(10px);
      }
      
      .page-transition-enter-active {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 300ms, transform 300ms;
      }
      
      .page-transition-exit {
        opacity: 1;
        transform: translateY(0);
      }
      
      .page-transition-exit-active {
        opacity: 0;
        transform: translateY(-10px);
        transition: opacity 300ms, transform 300ms;
      }
      `}
    </style>
  );
};

export default ButtonEffects;
