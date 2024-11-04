import { closest, setPlane } from '../utils.ts'
import { GameModeType, Ring } from './types.ts';

function randomRing(): Ring {
  const data = (new Array(10))
    .fill(0)
    .map(() => ({
      active: true,
      width: Math.ceil(Math.random() * 15) + 5,
    }))

  return {
    data
  }
}

const SurvivalMode: GameModeType = {
  reset(_ctx, _state) {
    return {
      rotation: 0,
      offset: null,
      rings: [
        randomRing(),
        randomRing(),
        randomRing(),
      ],
      score: 0,
      currentLevel: 1,
      speed: 1,
      t: 0
    }
  },

  rotate(r) {
    return { rotation: r }
  },

  step(ctx, state, kill = true) {
    let { speed, rings, offset, score, currentLevel, t, rotation } = state

    if (offset == null) {
      offset = Math.random() * 360
    }

    t += 1

    if (t % Math.round(60 * speed) === 0) {
      // reset timer to prevent glitches when changing speed
      t = 0

      let _r = rotation + offset

      if (_r < 0) {
        _r = 360 + (_r % 360)
      }

      if (kill) {
        const c = closest(rings, _r / 360 % 1)

        if (c[0] !== -1) {
          score += 1
          rings = setPlane(rings, c, { active: false })

          if (rings.some((ring) => ring.data.every((plane) => !plane.active))) {
            // clean ring bonus
            if (rings[0].data.every((plane) => !plane.active) && rings[1].data.every((plane) => plane.active)) {
              score += 10
            }

            currentLevel += 1

            rings = rings.filter((ring) => ring.data.some((plane) => plane.active))
            rings.push(randomRing())
          }
        } else {
          ctx.gameOver()
          return state
        }
      }

      // set offset for next cycle
      const lastOffset = offset
      offset = Math.random() * 360

      // protect against offsets being too close together
      if (Math.abs(offset - lastOffset) < 30) {
        offset = lastOffset + 30
      }
    }

    return { rings, offset, score, currentLevel, speed, t, rotation }
  }
}

export default SurvivalMode
