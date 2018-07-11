import React, {Component} from 'react'
import Ring from './Ring'

export default class Rings extends Component {
  render () {
    const {
      data,
      padWidth,
      innerRadius,
      padding
    } = this.props

    const ringCount = data.length

    return data.map((ring, i) => (
      <Ring
        key={i}
        ring={ring}
        padWidth={padWidth}
        padding={padding}
        innerRadius={(ringCount - i) * (padWidth + padding) + innerRadius - padding}
      />
    ))
  }
}
