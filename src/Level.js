import React, {Component} from 'react'
import {findStartPos, findEndPos, describeArc} from './utils'

export default class Level extends Component {
  constructor (props) {
    super(props)

    this.maskID = `level-mask-${Math.round(Math.random() * 99999)}`
  }

  render () {
    const {
      transform,
      level,
      padWidth,
      padding,
      innerRadius
    } = this.props

    return (
      <g transform={transform}>
        {level.data.map((pad, i) => {
          if (pad.active) {
            return (<path
              key={i}
              d={describeArc(innerRadius, innerRadius - padWidth, 360 * findStartPos(level, i), 360 * findEndPos(level, i), padding)}
              shapeRendering="auto"
              style={{fill: 'var(--pad-color)'}}
            />)
          } else {
            return null
          }
        })}
      </g>
    )
  }
}
