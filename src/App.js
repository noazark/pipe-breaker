import React, { Component } from 'react';
import classnames from 'classnames'
import {closest, setPlane} from './utils'
import TouchControl from './TouchControl'
import Levels from './Levels'
import {Motion, spring} from 'react-motion'

import './App.css'

function randomLevel(num=1) {
  const data = (new Array(10))
    .fill(0)
    .map(() => ({active: true, width: Math.ceil(Math.random() * 15) + 5}))
  const speed = 1

  return {
    speed,
    data
  }
}

class App extends Component {
  constructor(props) {
    super(props)

    this.loop = this.loop.bind(this)
    this.step = this.step.bind(this)
    this.reset = this.reset.bind(this)
    this.pause = this.pause.bind(this)
    this.play = this.play.bind(this)

    this.loopID = null
    this.t = 0

    this.state = {
      x: 0,
      offset: 0,
      levels: [],
      gameOver: false,
      paused: true,
      score: 0,
      level: 1
    }
  }

  loop() {
    this.t += 1

    if (this.t % Math.round(60 * this.state.levels[0].speed) === 0) {
      this.step()
    }
  }

  step() {
    let {levels, offset, score, level} = this.state

    let x = this.state.x + offset

    if (x < 0) {
      x = 360 + (x % 360)
    }
    const c = closest(levels, x / 360 % 1)

    if (c[0] !== -1) {
      score += 1
      levels = setPlane(levels, c, {active:false})

      if (levels.some((level) => level.data.every((plane) => !plane.active))) {
        // change levels
        level += 1
        // reset time so the next play speed doesn't jump the screen
        this.t = 0

        // clean level bonus
        if (levels[0].data.every((plane) => !plane.active) && levels[1].data.every((plane) => plane.active)) {
          score += 10
        }

        levels = levels.filter((level) => level.data.some((plane) => plane.active))
        levels.push(randomLevel(level + 1))
      }
    } else {
      this.setState({gameOver: true})
      clearInterval(this.loopID)
      return
    }

    // set offset for next cycle
    const lastOffset = offset
    offset = Math.random() * 360

    // protect against offsets being too close together
    if (Math.abs(offset - lastOffset) < 30) {
      offset = lastOffset + 30
    }

    this.setState({levels, offset, score, level})
  }

  reset() {
    this.setState({
      x: 0,
      gameOver: false,
      paused: true,
      offset: null,
      levels: [
        {...randomLevel(1), color: 'var(--pad-color)'},
        {...randomLevel(2), color: 'var(--pad-color)'},
        {...randomLevel(2), color: 'var(--pad-color)'},
      ],
      level: 1,
      score: 0
    })
  }

  pause () {
    this.setState({paused: true})

    if (this.loopID) {
      clearInterval(this.loopID)
    }
  }

  play () {
    let offset = this.state.offset

    if (offset == null) {
      offset = Math.random() * 360
    }

    this.setState({paused: false, offset})

    if (this.loopID) {
      clearInterval(this.loopID)
    }

    this.loopID = setInterval(() => this.loop(), 15)
  }

  componentDidMount() {
    this.reset()
  }

  render() {
    const innerRadius = 90
    const cursorRadius = 10
    const padWidth = 5
    const padding = 5
    const outerRadius = this.state.levels.length * (padWidth + padding) + innerRadius
    // 10 == cursor animation buffer
    const width = (outerRadius + (20 + cursorRadius) + padding) * 2

    return (
      <div id="page">
        <div id="game">
          <div id="board">
            <svg width={width} height={width}>
              <g transform={`translate(${width / 2}, ${width / 2})`}>
                <g transform={`rotate(${-this.state.x})`}>
                  <Levels
                    data={this.state.levels}
                    padWidth={padWidth}
                    innerRadius={innerRadius}
                    padding={padding}
                  />
                </g>

                <circle
                  onClick={this.reset}
                  className="top"
                  mask="url(#level-mask)"
                  r={innerRadius}
                  style={{
                    fill: this.state.gameOver? 'var(--error-color)' : 'var(--pad-color)',
                  }}
                />

                <Motion defaultStyle={{offset: 10}} style={{offset: spring(this.state.offset)}}>
                  {({offset}) => (
                    <g transform={`translate(0, -${outerRadius + cursorRadius + padding}) rotate(${offset}, ${0}, ${outerRadius + cursorRadius + padding})`}>
                      <circle className={classnames('cursor', {'bored': this.state.paused})} r={cursorRadius} style={{fill: this.state.gameOver? 'var(--error-color)' : 'var(--pad-color)'}}/>
                    </g>
                  )}
                </Motion>
              </g>
            </svg>

            <div id="score">
              lv. {this.state.level}
              <br/>
              {this.state.score}
            </div>
          </div>

          <div id="controls">
            <button
              className={
                classnames('btn', this.state.paused ? 'btn-play' : this.state.gameOver ? 'btn-reset' : 'btn-pause')
              }
              onClick={this.state.paused ? this.play : this.state.gameOver ? this.reset : this.pause}
            >
              {this.state.paused ? 'play' : this.state.gameOver ? 'reset' : 'pause'}
            </button>
          </div>
        </div>

        <TouchControl disabled={this.state.gameOver || this.state.paused} value={this.state.x} onChange={(x) => this.setState({x})}></TouchControl>
      </div>
    )
  }
}

export default App;
