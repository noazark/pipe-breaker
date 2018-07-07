import React, {Component} from 'react'
import {VictoryPie, Circle} from 'victory'

export default class extends Component {
  render () {
    const {
      data,
      padWidth,
      innerRadius,
      padding
    } = this.props
    const levelCount = data.length

    return (
      <g>
        <defs>
          <mask id='level-mask'>
            {data.map((level, i) =>
              <VictoryPie
                key={i}
                standalone={false}
                groupComponent={<g transform={`rotate(${-this.props.rotation})`} />}
                width={(i * (padWidth + padding) + innerRadius) * 2} height={(i * (padWidth + padding) + innerRadius) * 2}
                innerRadius={(levelCount - i) * (padWidth + padding) + innerRadius}
                origin={{x: 0, y: 0}}
                labels={() => null}
                data={level.data.map(p => p.width)}
                colorScale={level.data.map(p => p.active ? 'white' : 'black')}
                style={{
                  data: {
                    strokeWidth: padding,
                    stroke: 'black'
                  }
                }}
              />
            )}
          </mask>
        </defs>

        <g mask='url(#level-mask)'>
          {data.map((level, i) => (
            <Circle
              key={i}
              className='top'
              r={(levelCount - i) * ((padWidth + padding)+1) + innerRadius}
              style={{
                strokeWidth: padding,
                fill: 'var(--pad-color)'
              }}
            />
          ))}
        </g>
      </g>
    )
  }
}
