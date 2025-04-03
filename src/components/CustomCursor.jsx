import React, { useState, useEffect } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updatePosition);

    // Add event listeners for hoverable elements
    const hoverableElements = document.querySelectorAll('a, button, .hoverable');
    
    hoverableElements.forEach(element => {
      element.addEventListener('mouseenter', () => setIsHovering(true));
      element.addEventListener('mouseleave', () => setIsHovering(false));
    });

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      
      // Clean up hover listeners
      hoverableElements.forEach(element => {
        element.removeEventListener('mouseenter', () => setIsHovering(true));
        element.removeEventListener('mouseleave', () => setIsHovering(false));
      });
    };
  }, []);

  return (
    <>
      <div 
        className="cursor" 
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isHovering ? '40px' : '20px',
          height: isHovering ? '40px' : '20px'
        }}
      />
      <div 
        className="cursor-dot" 
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
      />
    </>
  );
};

export default CustomCursor;