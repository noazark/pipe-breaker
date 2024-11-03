import React from 'react'
import {findStartPos, findEndPos, describeArc} from './utils'

export default function Pad(props) {
  const {
    ring,
    pad,
    idx,
    padWidth,
    padding,
    innerRadius
  } = props

  const outerRadius = innerRadius + padWidth
  const startAngle = 360 * findStartPos(ring, idx)
  const endAngle = 360 * findEndPos(ring, idx)
  const path = describeArc(innerRadius, outerRadius, startAngle, endAngle, padding)

  return pad.active ? <path className=".pad" d={path} fill="var(--pad-color)" /> : null
}
