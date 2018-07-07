import * as utils from './utils'

test('closestLevel(levels, pos)', () => {
  const levels = [
    {data: [{width: 1, active: true}, {width: 2, active: true}, {width: 3, active: false}]},
    {data: [{width: 4, active: true}, {width: 5, active: true}, {width: 6, active: true}]}
  ]

  expect(utils.closest(levels, 1.0000)).toEqual([1, 2])
  expect(utils.closest(levels, 0.5001)).toEqual([1, 1])
  expect(utils.closest(levels, 0.5000)).toEqual([0, 1])
  expect(utils.closest(levels, 0.1666)).toEqual([0, 0])
  expect(utils.closest(levels, 0.0000)).toEqual([0, 0])
})

test('findStartPos(level, i)', () => {
  const level = {data: [{width: 1}, {width: 2}, {width: 3}]}
  expect(utils.findStartPos(level, 0)).toEqual(0)
  expect(utils.findStartPos(level, 1)).toEqual(1/6)
  expect(utils.findStartPos(level, 2)).toEqual(0.5)
})

test('findEndPos(level, i)', () => {
  const level = {data: [{width: 1}, {width: 2}, {width: 3}]}
  expect(utils.findEndPos(level, 0)).toEqual(1/6)
  expect(utils.findEndPos(level, 1)).toEqual(0.5)
  expect(utils.findEndPos(level, 2)).toEqual(1)
})

test('setPlane()', () => {
  const levels = [
    {data: [{width: 1, active: true}, {width: 2, active: true}, {width: 3, active: true}]},
    {data: [{width: 4, active: true}, {width: 5, active: true}, {width: 6, active: true}]}
  ]

  expect(utils.setPlane(levels, [0, 1], {active: false})[0].data[1]).toEqual({width: 2, active: false})
})
