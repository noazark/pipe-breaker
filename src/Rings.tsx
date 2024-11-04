import React from 'react';
import Ring from './Ring.tsx';

const Rings = ({ data, padWidth, innerRadius, padding }) => {
  const ringCount = data.length;

  return data.map((ring, i) => (
    <Ring
      key={i}
      ring={ring}
      padWidth={padWidth}
      padding={padding}
      innerRadius={(ringCount - i) * (padWidth + padding) + innerRadius - padding}
    />
  ));
};

export default Rings;
