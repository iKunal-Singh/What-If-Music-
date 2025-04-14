
import React, { useEffect, useState } from "react";

interface CursorPosition {
  x: number;
  y: number;
}

const CustomCursor = () => {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // Only show cursor after first mouse movement
    const addEventListeners = () => {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseenter", onMouseEnter);
      document.addEventListener("mouseleave", onMouseLeave);
      document.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mouseover", onMouseOver);
    };

    const removeEventListeners = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
    };

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setHidden(false);
    };

    const onMouseEnter = () => setHidden(false);
    const onMouseLeave = () => setHidden(true);
    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if hovering over a button
      const isOverButton = target.tagName === "BUTTON" || 
                         Boolean(target.closest("button")) ||
                         target.classList.contains("btn") || 
                         Boolean(target.closest(".btn"));
                         
      // Check if hovering over a link
      const isOverLink = target.tagName === "A" || 
                       Boolean(target.closest("a")) ||
                       target.classList.contains("link") || 
                       Boolean(target.closest(".link"));
      
      setIsPointer(isOverButton);
      setIsLink(isOverLink && !isOverButton);
    };

    addEventListeners();
    return () => removeEventListeners();
  }, []);

  return (
    <>
      {/* Hide default cursor */}
      <style>
        {`
        body {
          cursor: none;
        }
        a, button, .btn, [role="button"] {
          cursor: none;
        }
        `}
      </style>
      
      {/* Main cursor */}
      <div 
        className={`fixed top-0 left-0 z-[9999] pointer-events-none transition-opacity duration-300 ${hidden ? 'opacity-0' : 'opacity-100'}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          zIndex: 9999,
        }}
      >
        {/* Base cursor */}
        <div 
          className={`rounded-full mix-blend-difference ${
            isClicking ? 'scale-75' : 'scale-100'
          } transition-all duration-150`}
          style={{
            width: isPointer || isLink ? '40px' : '20px',
            height: isPointer || isLink ? '40px' : '20px',
            marginLeft: isPointer || isLink ? '-20px' : '-10px',
            marginTop: isPointer || isLink ? '-20px' : '-10px',
            backgroundColor: isPointer ? 'rgba(227, 66, 52, 0.6)' : 'white',
            transition: 'width 0.2s, height 0.2s, margin 0.2s, background-color 0.3s',
          }}
        >
          {isPointer && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
              >
                <path d="M9 18V5l12 7-12 7z"></path>
              </svg>
            </div>
          )}
          
          {isLink && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-white glitch-effect"></div>
            </div>
          )}
        </div>
        
        {/* Trail effect */}
        <div className="trail absolute">
          {Array.from({ length: 5 }).map((_, index) => (
            <div 
              key={index} 
              className="trail-dot absolute rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 opacity-40"
              style={{
                width: `${16 - index * 2}px`,
                height: `${16 - index * 2}px`,
                transform: `translate(-50%, -50%) translateY(${index * 3}px)`,
                animationDelay: `${index * 0.05}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CustomCursor;
