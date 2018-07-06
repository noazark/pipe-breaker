import React, { Component } from 'react';
import {Circle, VictoryAnimation} from 'victory'
import {closest, setPlane} from './utils'
import TouchControl from './TouchControl'
import Levels from './Levels'

import './App.css'

function randomLevel() {
  return (new Array(10))
    .fill(0)
    .map(() => ({active: true, width: Math.ceil(Math.random() * 15) + 5}))
}

class App extends Component {
  constructor(props) {
    super(props)

    this.loop = this.loop.bind(this)
    this.reset = this.reset.bind(this)
    this.pause = this.pause.bind(this)
    this.play = this.play.bind(this)

    this.loopID = null

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
    let {levels, offset, score, level} = this.state

    let x = this.state.x + offset

    if (x < 0) {
      x = 360 + (x % 360)
    }
    const c = closest(levels, x / 360 % 1)

    if (c[0] !== -1) {
      score += 1
      levels = setPlane(levels, c, {active:false})

      if (levels.some((level) => level.every((plane) => !plane.active))) {
        level += 1

        // clean level bonus
        if (levels[0].every((plane) => !plane.active) && levels[1].every((plane) => plane.active)) {
          score += 10
        }

        levels = levels.filter((level) => level.some((plane) => plane.active))
        levels.push(randomLevel())
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
      oxset: 0,
      gameOver: false,
      paused: true,
      offset: Math.random() * 360,
      levels: [
        randomLevel(),
        randomLevel(),
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
    this.setState({paused: false})

    if (this.loopID) {
      clearInterval(this.loopID)
    }

    this.loopID = setInterval(() => this.loop(), 1000)
  }

  componentDidMount() {
    this.reset()
  }

  render() {
    const width = 375
    const outerRadius = 100
    const innerRadius = 50
    const cursorRadius = 10
    const borderWidth = 2.5

    return (
      <div id="page">
        <div id="game">
          <div id="board">
            <svg width={width} height={width}>
              <g transform={`translate(${width / 2}, ${width / 2})`}>
                <Levels
                  data={this.state.levels}
                  outerRadius={outerRadius}
                  innerRadius={innerRadius}
                  rotation={this.state.x}
                  style={{
                    strokeWidth: borderWidth
                  }}
                />

                <Circle
                  events={{
                    onClick: this.reset
                  }}
                  className="top"
                  mask="url(#level-mask)"
                  r={innerRadius}
                  style={{
                    fill: this.state.gameOver? 'red': 'black',
                    strokeWidth: borderWidth,
                    stroke: 'white'
                  }}
                />

                <VictoryAnimation duration={300} easing="polyOut" data={{offset: this.state.offset}}>
                  {(data) => (
                    <g transform={`translate(0, -${outerRadius + cursorRadius + borderWidth}) rotate(${data.offset}, ${0}, ${outerRadius + cursorRadius + borderWidth})`}>
                      <Circle className="cursor" r={cursorRadius} style={{fill: 'black'}}/>
                    </g>
                  )}
                </VictoryAnimation>
              </g>
            </svg>

            <div id="score">
              lv. {this.state.level}
              <br/>
              {this.state.score}
            </div>
          </div>

          {this.state.paused ? (
            <button onClick={this.play}>play</button>
          ) : (
            <button onClick={this.pause}>pause</button>
          )}
        </div>

        <TouchControl disabled={this.state.gameOver || this.state.paused} value={this.state.x} onChange={(x) => this.setState({x})}></TouchControl>
      </div>
    )
  }
}

export default App;
