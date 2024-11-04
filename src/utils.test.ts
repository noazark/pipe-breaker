import * as utils from './utils.ts'

test('closestRing(rings, pos)', () => {
  const rings = [
    { data: [{ width: 1, active: true }, { width: 2, active: true }, { width: 3, active: false }] },
    { data: [{ width: 4, active: true }, { width: 5, active: true }, { width: 6, active: true }] }
  ]

  expect(utils.closest(rings, 1.0000)).toEqual([1, 2])
  expect(utils.closest(rings, 0.5001)).toEqual([1, 1])
  expect(utils.closest(rings, 0.5000)).toEqual([0, 1])
  expect(utils.closest(rings, 0.1666)).toEqual([0, 0])
  expect(utils.closest(rings, 0.0000)).toEqual([0, 0])
})

test('findStartPos(ring, i)', () => {
  const ring = { data: [{ width: 1 }, { width: 2 }, { width: 3 }] }
  expect(utils.findStartPos(ring, 0)).toEqual(0)
  expect(utils.findStartPos(ring, 1)).toEqual(1 / 6)
  expect(utils.findStartPos(ring, 2)).toEqual(0.5)
})

test('findEndPos(ring, i)', () => {
  const ring = { data: [{ width: 1 }, { width: 2 }, { width: 3 }] }
  expect(utils.findEndPos(ring, 0)).toEqual(1 / 6)
  expect(utils.findEndPos(ring, 1)).toEqual(0.5)
  expect(utils.findEndPos(ring, 2)).toEqual(1)
})

test('setPlane()', () => {
  const rings = [
    { data: [{ width: 1, active: true }, { width: 2, active: true }, { width: 3, active: true }] },
    { data: [{ width: 4, active: true }, { width: 5, active: true }, { width: 6, active: true }] }
  ]

  expect(utils.setPlane(rings, [0, 1], { active: false })[0].data[1]).toEqual({ width: 2, active: false })
})
