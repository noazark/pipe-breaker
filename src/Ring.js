import React from 'react'
import Pad from './Pad'

export default function Ring (props) {
  const {
    ring,
    padWidth,
    padding,
    innerRadius
  } = props

  return (
    ring.data.map((pad, idx) => (
      <Pad
        key={idx}
        ring={ring}
        pad={pad}
        idx={idx}
        innerRadius={innerRadius}
        padding={padding}
        padWidth={padWidth}
      />
    ))
  )
}
