
import React, { useEffect } from "react";

const UIEffects = () => {
  useEffect(() => {
    // Simplified parallax effect with fewer elements and optimized calculations
    const handleScroll = () => {
      // Throttle the scroll event for better performance
      if (!window.requestAnimationFrame) return;
      
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        parallaxElements.forEach((element) => {
          const speed = parseFloat((element as HTMLElement).dataset.speed || '0.1');
          (element as HTMLElement).style.transform = `translateY(${scrollY * speed}px)`;
        });
      });
    };

    // Add more efficient event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Reduced number of floating elements for better performance
    const addFloatingNotes = () => {
      const container = document.createElement('div');
      container.className = 'fixed inset-0 pointer-events-none overflow-hidden z-0';
      document.body.appendChild(container);
      
      // Create only 5 floating music notes instead of 10
      for (let i = 0; i < 5; i++) {
        const note = document.createElement('div');
        const size = Math.floor(Math.random() * 20) + 15;
        const posX = Math.floor(Math.random() * window.innerWidth);
        const posY = Math.floor(Math.random() * window.innerHeight);
        const speed = (Math.random() * 0.03) + 0.01; // Reduced speed value
        const opacity = (Math.random() * 0.3) + 0.1;
        
        note.className = 'parallax-element absolute text-beatwave-500/20';
        note.dataset.speed = speed.toString();
        note.style.left = `${posX}px`;
        note.style.top = `${posY}px`;
        note.style.fontSize = `${size}px`;
        note.style.opacity = opacity.toString();
        note.innerHTML = i % 2 === 0 ? '♪' : '♫';
        
        container.appendChild(note);
      }
    };
    
    addFloatingNotes();

    return () => {
      window.removeEventListener('scroll', handleScroll);
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
