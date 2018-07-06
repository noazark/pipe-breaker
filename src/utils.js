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
