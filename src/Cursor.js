import React, { useState, useEffect } from 'react';
import './App.css';

const AnimatedCursor = ({ theta, outerRadius, cursorRadius, padding, gameOver, paused }) => {
  // Calculate position using polar coordinates
  const radius = outerRadius + cursorRadius + padding;

  // State to manage the transform style
  const [transformStyle, setTransformStyle] = useState({
    transform: `rotate(0deg) translate(0, -${radius}px)`,
    transition: 'transform 0.2s ease-out',
  });

  // State to keep track of the previous angle
  const [prevTheta, setPrevTheta] = useState(0);

  // Function to calculate the shortest angular distance
  const calculateShortestAngle = (from, to) => {
    let delta = to - from;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    return delta;
  };

  // Update the transform style after the component mounts
  useEffect(() => {
    const shortestAngle = calculateShortestAngle(prevTheta, theta);
    const newTheta = prevTheta + shortestAngle;

    setTransformStyle({
      transform: `rotate(${newTheta}deg) translate(0, -${radius}px)`,
      transition: 'transform 0.2s ease-out',
    });

    setPrevTheta(newTheta);
  }, [theta, radius, prevTheta]);

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
