import React, { useState, useEffect } from 'react';
import './Cursor.css';

// Separate animated cursor component using hooks
const AnimatedCursor = ({ theta, outerRadius, cursorRadius, padding, gameOver, paused }) => {
  // Calculate position using polar coordinates
  const radius = outerRadius + cursorRadius + padding;

  // State to manage the transform style
  const [transformStyle, setTransformStyle] = useState({
    transform: `rotate(0deg) translate(0, -${radius}px)`,
    transition: 'transform 0.2s ease-out',
  });

  // Update the transform style after the component mounts
  useEffect(() => {
    setTransformStyle({
      transform: `rotate(${theta}deg) translate(0, -${radius}px)`,
      transition: 'transform 0.2s ease-out',
    });
  }, [theta, radius]);

  return (
    <g style={transformStyle}>
      <circle
        className={`cursor ${paused ? 'bored' : ''}`}
        r={cursorRadius}
        style={{
          fill: gameOver ? 'var(--error-color)' : 'var(--pad-color)',
        }}
      />
    </g>
  );
};

export default AnimatedCursor;
