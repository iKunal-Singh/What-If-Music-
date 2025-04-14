
import React, { useEffect, useState } from "react";

interface CursorPosition {
  x: number;
  y: number;
}

const CustomCursor = () => {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // Optimization: Use passive event listeners for improved performance
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setHidden(false);
    };

    const onMouseEnter = () => setHidden(false);
    const onMouseLeave = () => setHidden(true);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.tagName === "BUTTON" || 
                            Boolean(target.closest("button")) ||
                            target.tagName === "A" || 
                            Boolean(target.closest("a")) ||
                            target.classList.contains("btn") || 
                            Boolean(target.closest(".btn"));
      
      setIsPointer(isInteractive);
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

  // Don't render anything if hidden (performance optimization)
  if (hidden) return null;

  return (
    <>
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
      
      {/* Simplified cursor */}
      <div 
        className="fixed top-0 left-0 z-[9999] pointer-events-none transition-transform duration-100"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        {/* Simple dot cursor */}
        <div 
          className="rounded-full bg-white mix-blend-difference transition-all duration-150"
          style={{
            width: isPointer ? '30px' : '12px',
            height: isPointer ? '30px' : '12px',
            marginLeft: isPointer ? '-15px' : '-6px',
            marginTop: isPointer ? '-15px' : '-6px',
          }}
        />
      </div>
    </>
  );
};

export default CustomCursor;
