import React, {Component} from 'react'
import {findStartPos, findEndPos} from './utils'

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(innerRadius, outerRadius, startAngle, endAngle, padding){
    const x = 0
    const y= 0

    const _paddingInner = 360 - 360 * (2 * Math.PI * innerRadius - padding) / (2 * Math.PI * innerRadius)
    const _paddingOuter = 360 - 360 * (2 * Math.PI * outerRadius - padding) / (2 * Math.PI * outerRadius)

    const start0 = polarToCartesian(x, y, innerRadius, startAngle + _paddingOuter/2);
    const end0 = polarToCartesian(x, y, innerRadius, endAngle - _paddingOuter/2);
    const end1 = polarToCartesian(x, y, outerRadius, endAngle - _paddingInner/2);
    const start1 = polarToCartesian(x, y, outerRadius, startAngle + _paddingInner/2);

    const largeArcFlag = endAngle - startAngle <= 180 ? "1" : "0";
    const largeArcFlagInner = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", [start0.x, start0.y].join(','),
        "A", [innerRadius, innerRadius, 0, 0, largeArcFlag, end0.x, end0.y].join(','),
        "L", [end1.x, end1.y].join(','),
        "A", [outerRadius, outerRadius, 0, 0, largeArcFlagInner, start1.x, start1.y].join(','),
        "Z"
    ].join("");

    return d;
}

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
