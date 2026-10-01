import React, { useRef, useState } from 'react';

const MagneticButton = ({ children, className = '', style = {}, onClick, dataCursor, ...props }) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseMove = (e) => {
    if (!buttonRef.current || window.matchMedia('(pointer: coarse)').matches) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center (max 10px offset)
    const distanceX = (e.clientX - centerX) * 0.22;
    const distanceY = (e.clientY - centerY) * 0.22;
    
    setPosition({ x: distanceX, y: distanceY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsPressed(false);
  };

  return (
    <button
      ref={buttonRef}
      className={className}
      data-cursor={dataCursor}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{
        ...style,
        transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isPressed ? 0.95 : 1})`,
        transition: isPressed
          ? 'transform 0.1s ease-out'
          : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform',
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default MagneticButton;
