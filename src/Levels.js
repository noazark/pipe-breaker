import React, {Component} from 'react'
import Level from './Level'

export default class Levels extends Component {
  render () {
    const {
      data,
      padWidth,
      innerRadius,
      padding,
      rotation
    } = this.props

    const levelCount = data.length

    return data.map((level, i) => (
      <Level
        transform={`rotate(${-rotation})`}
        key={i}
        level={level}
        padWidth={padWidth}
        padding={padding}
        innerRadius={(levelCount - i) * (padWidth + padding) + innerRadius - padding}
      />
    ))
  }
}
