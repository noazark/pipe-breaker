import React from 'react'
import {findStartPos, findEndPos, describeArc} from './utils'

export default function Pad (props) {
  const {
    level,
    pad,
    idx,
    padWidth,
    padding,
    innerRadius
  } = props

  const outerRadius = innerRadius + padWidth
  const startAngle = 360 * findStartPos(level, idx)
  const endAngle = 360 * findEndPos(level, idx)
  const path = describeArc(innerRadius, outerRadius, startAngle, endAngle, padding)

  return pad.active ? <path className=".pad" d={path} /> : null
}
