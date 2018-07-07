function sum(arr) {
  return arr.reduce((agg, p) => agg + p.width, 0)
}

export function findStartPos(level, i) {
  return sum(level.data.slice(0, i)) / sum(level.data)
}

export function findEndPos(level, i) {
  return sum(level.data.slice(0, i + 1)) / sum(level.data)
}

export function closest(levels, pos) {
  let lidx, pidx;

  lidx = levels.findIndex((level) => {
    pidx = level.data.findIndex((plane, i) => {
      if (!plane.active) {
        return null
      } else {
        return findStartPos(level, i) <= pos && findEndPos(level, i) >= pos
      }
    })

    return pidx >= 0
  })

  return [lidx, pidx]
}

export function setPlane(levels, s, obj) {
  return Object.values({
    ...levels,
    [s[0]]: {
      ...levels[s[0]],
      data: Object.values({
        ...levels[s[0]].data,
        [s[1]]: {
          ...levels[s[0]].data[s[1]],
          ...obj
        }
      })
    }
  })
}

export function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

export function describeArc(innerRadius, outerRadius, startAngle, endAngle, padding){
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
