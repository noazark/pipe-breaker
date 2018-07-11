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
    this.step = this.step.bind(this)

    this.loopID = null
    this.level = survival

    this.state = {
      // level state
      ...this.level.reset(this, this.state),

      // game state
      t: 0,
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
    const t = this.state.t + 1
    this.setState({t})

    if (t % Math.round(60 * this.state.speed) === 0) {
      this.step()
    }

    this.loopID = window.requestAnimationFrame(this.loop)
  }

  pause () {
    this.setState({paused: true})

    if (this.loopID) {
      window.cancelAnimationFrame(this.loopID)
    }
  }

  play () {
    const state = this.level.step(this, this.state, false)

    this.setState({...state, paused: false})

    if (this.loopID) {
      window.cancelAnimationFrame(this.loopID)
    }

    this.loop()
  }

  reset() {
    const state = this.level.reset(this, this.state)
    this.setState({
      ...state,
      gameOver: false,
      paused: true,
    })
  }

  step() {
    const state = this.level.step(this, this.state)
    this.setState(state)
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
