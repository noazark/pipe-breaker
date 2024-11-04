import React from 'react'
import { findStartPos, findEndPos, describeArc } from './utils.ts'
import { Ring, RingPad } from './levels/types';

interface PadProps {
  ring: Ring;
  pad: RingPad;
  idx: number;
  padWidth: number;
  padding: number;
  innerRadius: number;
}
export default function Pad(props: PadProps) {
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

  return pad.active ? <path className=".pad" d={path} fill={pad.color || ring.color || 'var(--pad-color)'} /> : null
}
