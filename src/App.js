import React, { Component } from 'react';
import classnames from 'classnames'
import {closest, setPlane} from './utils'
import TouchControl from './TouchControl'
import Rings from './Rings'
import {Motion, spring} from 'react-motion'

import './App.css'

function randomRing(num=1) {
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
      // ring state
      rings: [],
      rotation: 0,
      offset: 0,

      // game state
      gameOver: false,
      paused: true,
      score: 0,
      ring: 1
    }
  }

  loop() {
    this.t += 1

    if (this.t % Math.round(60 * this.state.rings[0].speed) === 0) {
      this.step()
    }
  }

  step() {
    let {rings, offset, score, ring} = this.state

    let rotation = this.state.rotation + offset

    if (rotation < 0) {
      rotation = 360 + (rotation % 360)
    }
    const c = closest(rings, rotation / 360 % 1)

    if (c[0] !== -1) {
      score += 1
      rings = setPlane(rings, c, {active:false})

      if (rings.some((ring) => ring.data.every((plane) => !plane.active))) {
        // change rings
        ring += 1
        // reset time so the next play speed doesn't jump the screen
        this.t = 0

        // clean ring bonus
        if (rings[0].data.every((plane) => !plane.active) && rings[1].data.every((plane) => plane.active)) {
          score += 10
        }

        rings = rings.filter((ring) => ring.data.some((plane) => plane.active))
        rings.push(randomRing(ring + 1))
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

    this.setState({rings, offset, score, ring})
  }

  reset() {
    this.setState({
      rotation: 0,
      gameOver: false,
      paused: true,
      offset: null,
      rings: [
        {...randomRing(1), color: 'var(--pad-color)'},
        {...randomRing(2), color: 'var(--pad-color)'},
        {...randomRing(2), color: 'var(--pad-color)'},
      ],
      ring: 1,
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
    const outerRadius = this.state.rings.length * (padWidth + padding) + innerRadius
    // 10 == cursor animation buffer
    const width = (outerRadius + (20 + cursorRadius) + padding) * 2

    return (
      <div id="page">
        <div id="game">
          <div id="board">
            <svg width={width} height={width}>
              <g transform={`translate(${width / 2}, ${width / 2})`}>
                <g transform={`rotate(${-this.state.rotation})`}>
                  <Rings
                    data={this.state.rings}
                    padWidth={padWidth}
                    innerRadius={innerRadius}
                    padding={padding}
                  />
                </g>

                <circle
                  onClick={this.reset}
                  className="top"
                  mask="url(#ring-mask)"
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
              lv. {this.state.ring}
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

        <TouchControl disabled={this.state.gameOver || this.state.paused} value={this.state.rotation} onChange={(rotation) => this.setState({rotation})}></TouchControl>
      </div>
    )
  }
}

export default App;
