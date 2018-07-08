import React from 'react'
import Pad from './Pad'

export default function Level (props) {
  const {
    transform,
    level,
    padWidth,
    padding,
    innerRadius
  } = props

  return (
    <g transform={transform}>
      {level.data.map((pad, idx) => (
        <Pad
          key={idx}
          level={level}
          pad={pad}
          idx={idx}
          innerRadius={innerRadius}
          padding={padding}
          padWidth={padWidth}
        />
      ))}
    </g>
  )
}
