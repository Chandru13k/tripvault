import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let animationFrameId;

    const onMouseMove = (e) => {
      setIsVisible(true);
      animationFrameId = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
      });

      // Check hovered elements for data-cursor attribute
      const target = e.target.closest('[data-cursor]');
      if (target) {
        setCursorText(target.getAttribute('data-cursor') || '');
        setIsHovered(true);
      } else {
        setCursorText('');
        setIsHovered(false);
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isVisible || window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: 'transform 0.08s ease-out, width 0.25s ease, height 0.25s ease, background-color 0.25s ease',
      }}
    >
      <div
        style={{
          transform: 'translate(-50%, -50%)',
          width: isHovered ? (cursorText ? '84px' : '36px') : '10px',
          height: isHovered ? (cursorText ? '32px' : '36px') : '10px',
          borderRadius: isHovered ? '20px' : '50%',
          background: isHovered ? 'rgba(217, 107, 67, 0.9)' : 'var(--accent-terracotta)',
          boxShadow: isHovered ? '0 4px 20px rgba(217, 107, 67, 0.5)' : 'none',
          backdropFilter: isHovered ? 'blur(6px)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: '0.725rem',
          fontWeight: 700,
          fontFamily: 'var(--font-label)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          padding: isHovered && cursorText ? '0 10px' : '0',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {cursorText}
      </div>
    </div>
  );
};

export default CustomCursor;
