import React, { Component } from 'react';
import classnames from 'classnames'
import TouchControl from './TouchControl'
import Rings from './Rings'
import {Motion, spring} from 'react-motion'

import survival from './levels/survival'

import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.gameOver = this.gameOver.bind(this)
    this.loop = this.loop.bind(this)
    this.pause = this.pause.bind(this)
    this.play = this.play.bind(this)
    this.reset = this.reset.bind(this)

    this.loopID = null
    this.level = survival

    this.state = {
      // level state
      level: this.level.reset(this, this.state),

      // game state
      gameOver: false,
      paused: true,
    }
  }

  gameOver() {
    window.cancelAnimationFrame(this.loopID)
    this.loopID = null

    this.setState({gameOver: true})
  }

  loop() {
    const level = this.level.step(this, this.state.level)
    this.setState({level})

    if (!this.state.paused) {
      this.loopID = window.requestAnimationFrame(this.loop)
    }
  }

  pause () {
    this.setState({paused: true})

    if (this.loopID) {
      window.cancelAnimationFrame(this.loopID)
    }
  }

  play () {
    if (this.loopID) {
      window.cancelAnimationFrame(this.loopID)
    }

    this.setState({paused: false})
    window.requestAnimationFrame(this.loop)
  }

  reset() {
    const level = this.level.reset(this, this.state)
    this.setState({
      level,
      gameOver: false,
      paused: true,
    })
  }

  rotate(r) {
    const level = this.level.rotate(r)
    this.setState({
      level: {
        ...this.state.level,
        ...level
      }
    })
  }

  componentDidMount() {
    this.reset()
  }

  render() {
    const {level} = this.state

    const innerRadius = 90
    const cursorRadius = 10
    const padWidth = 5
    const padding = 5
    const outerRadius = level.rings.length * (padWidth + padding) + innerRadius
    // 10 == cursor animation buffer
    const width = (outerRadius + (20 + cursorRadius) + padding) * 2

    return (
      <div id="page">
        <div id="game">
          <div id="board">
            <svg width={width} height={width}>
              <g transform={`translate(${width / 2}, ${width / 2})`}>
                <g transform={`rotate(${-level.rotation})`}>
                  <Rings
                    data={level.rings}
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

                <Motion defaultStyle={{offset: 10}} style={{offset: spring(level.offset)}}>
                  {({offset}) => (
                    <g transform={`translate(0, -${outerRadius + cursorRadius + padding}) rotate(${offset}, ${0}, ${outerRadius + cursorRadius + padding})`}>
                      <circle className={classnames('cursor', {'bored': this.state.paused})} r={cursorRadius} style={{fill: this.state.gameOver? 'var(--error-color)' : 'var(--pad-color)'}}/>
                    </g>
                  )}
                </Motion>
              </g>
            </svg>

            <div id="score">
              lv. {level.ring}
              <br/>
              {level.score}
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

        <TouchControl disabled={this.state.gameOver || this.state.paused} value={level.rotation} onChange={(rotation) => this.rotate(rotation)}></TouchControl>
      </div>
    )
  }
}

export default App;
