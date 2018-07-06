import React, {Component} from 'react'
import {VictoryPie, Circle} from 'victory'

export default class extends Component {
  render () {
    const {
      data,
      innerRadius,
      outerRadius
    } = this.props
    const levelCount = data.length
    const ringWidth = (outerRadius - innerRadius) / levelCount

    return (
      <g>
        <defs>
          <mask id='level-mask'>
            {data.map((level, i) =>
              <VictoryPie
                key={i}
                standalone={false}
                groupComponent={<g transform={`rotate(${-this.props.rotation})`} />}
                width={outerRadius * 2} height={outerRadius * 2}
                innerRadius={(levelCount - i) * ringWidth + innerRadius}
                origin={{x: 0, y: 0}}
                labels={() => null}
                data={level.data.map(p => p.width)}
                colorScale={level.data.map(p => p.active ? 'white' : 'black')}
                style={{
                  data: {
                    ...this.props.style,
                    stroke: 'black'
                  }
                }}
              />
            )}
          </mask>
        </defs>

        <g mask='url(#level-mask)'>
          <Circle
            className='top'
            r={outerRadius}
            style={{
              ...this.props.style,
              fill: 'black'
            }}
          />
        </g>
      </g>
    )
  }
}
