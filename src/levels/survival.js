import {closest, setPlane} from '../utils'

function randomRing(num=1) {
  const data = (new Array(10))
    .fill(0)
    .map(() => ({active: true, width: Math.ceil(Math.random() * 15) + 5}))

  return {
    data
  }
}

export default {
  reset(ctx, state) {
    return {
      rotation: 0,
      offset: null,
      rings: [
        {...randomRing(1), color: 'var(--pad-color)'},
        {...randomRing(2), color: 'var(--pad-color)'},
        {...randomRing(2), color: 'var(--pad-color)'},
      ],
      ring: 1,
      score: 0,
      speed: 0,
    }
  },

  step(ctx, state, kill=true) {
    let {rings, offset, score, ring} = state

    let rotation = state.rotation + offset

    if (rotation < 0) {
      rotation = 360 + (rotation % 360)
    }

    if (kill) {
      const c = closest(rings, rotation / 360 % 1)

      if (c[0] !== -1) {
        score += 1
        rings = setPlane(rings, c, {active:false})

        if (rings.some((ring) => ring.data.every((plane) => !plane.active))) {
          // change rings
          ring += 1

          // clean ring bonus
          if (rings[0].data.every((plane) => !plane.active) && rings[1].data.every((plane) => plane.active)) {
            score += 10
          }

          rings = rings.filter((ring) => ring.data.some((plane) => plane.active))
          rings.push(randomRing(ring + 1))
        }
      } else {
        ctx.gameOver()
        return
      }
    }

    // set offset for next cycle
    const lastOffset = offset
    offset = Math.random() * 360

    // protect against offsets being too close together
    if (Math.abs(offset - lastOffset) < 30) {
      offset = lastOffset + 30
    }

    const speed = 1

    return {rings, offset, score, ring, speed}
  }
}
