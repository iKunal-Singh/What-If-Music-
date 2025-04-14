
import React, { useEffect } from "react";

const UIEffects = () => {
  useEffect(() => {
    // Parallax scroll effect
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const parallaxElements = document.querySelectorAll('.parallax-element');
      
      parallaxElements.forEach((element) => {
        const speed = parseFloat((element as HTMLElement).dataset.speed || '0.1');
        (element as HTMLElement).style.transform = `translateY(${scrollY * speed}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    
    // Add floating music notes to the DOM
    const addFloatingNotes = () => {
      const container = document.createElement('div');
      container.className = 'fixed inset-0 pointer-events-none overflow-hidden z-0';
      document.body.appendChild(container);
      
      // Create 10 floating music notes
      for (let i = 0; i < 10; i++) {
        const note = document.createElement('div');
        const size = Math.floor(Math.random() * 30) + 20;
        const posX = Math.floor(Math.random() * window.innerWidth);
        const posY = Math.floor(Math.random() * window.innerHeight);
        const speed = (Math.random() * 0.05) + 0.02;
        const opacity = (Math.random() * 0.4) + 0.1;
        const rotation = Math.floor(Math.random() * 360);
        
        note.className = 'parallax-element absolute text-beatwave-500/30';
        note.dataset.speed = speed.toString();
        note.style.left = `${posX}px`;
        note.style.top = `${posY}px`;
        note.style.fontSize = `${size}px`;
        note.style.opacity = opacity.toString();
        note.style.transform = `rotate(${rotation}deg)`;
        note.innerHTML = i % 2 === 0 ? '♪' : '♫';
        
        container.appendChild(note);
      }
    };
    
    addFloatingNotes();

    // Clean up event listeners
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <style jsx global>{`
      /* Animated gradient background */
      body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(-45deg, #240805, #55130C, #1A1F2C, #000);
        background-size: 400% 400%;
        z-index: -1;
        animation: gradientBG 15s ease infinite;
        opacity: 0.3;
      }
      
      @keyframes gradientBG {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      /* Animated gradient text for headings */
      h1, h2 {
        background-image: linear-gradient(
          90deg,
          #E34234, #FFE29F, #E34234
        );
        background-size: 200% auto;
        background-clip: text;
        text-fill-color: transparent;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shine 8s linear infinite;
      }
      
      @keyframes shine {
        0% { background-position: 0% center; }
        100% { background-position: 200% center; }
      }
      
      /* Glitch effect for links */
      .glitch-effect {
        position: relative;
        animation: glitch 1s infinite;
      }
      
      @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
      }
      
      /* Trail animation for cursor */
      .trail-dot {
        animation: trail 1s linear forwards;
      }
      
      @keyframes trail {
        0% { opacity: 0.4; }
        100% { opacity: 0; transform: translate(-50%, -50%) translateY(15px); }
      }
    `}</style>
  );
};

export default UIEffects;
