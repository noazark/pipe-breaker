import React, { Component } from 'react';
import {VictoryPie, Circle, VictoryAnimation} from 'victory'
import {closest, setPlane} from './utils'

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
    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)

    this.loopID = null

    this.state = {
      x: 0,
      oxset: 0,
      offset: 0,
      levels: [],
      gameOver: false,
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
      this.disableTouch()
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

  enableTouch() {
    document.addEventListener('touchstart', this.onTouchStart, { passive: true })
    document.addEventListener('touchend', this.onTouchEnd, { passive: true })
    document.addEventListener('touchmove', this.onTouchMove, { passive: true })
  }

  disableTouch() {
    document.removeEventListener('touchstart', this.onTouchStart)
    document.removeEventListener('touchend', this.onTouchEnd)
    document.removeEventListener('touchmove', this.onTouchMove)
  }

  reset() {
    if (this.loopID) {
      clearInterval(this.loopID)
    }

    this.loopID = setInterval(() => this.loop(), 1000)

    this.setState({
      x: 0,
      oxset: 0,
      gameOver: false,
      offset: Math.random() * 360,
      levels: [
        randomLevel(),
        randomLevel(),
      ],
      level: 1,
      score: 0
    })
    this.enableTouch()
  }

  componentDidMount() {
    this.reset()
  }

  componentWillUnmount() {
    this.disableTouch()
  }

  onTouchStart(e) {
    const rotation = -Math.atan2(e.touches[0].pageY - 333.5, e.touches[0].pageX - 187.5) * 180*4 / Math.PI;

    this.setState({oxset: this.state.oxset - rotation})
    this.onTouchMove(e)
  }

  onTouchEnd(e) {
    this.setState({oxset: this.state.x})
  }

  onTouchMove(e) {
    const rotation = -Math.atan2(e.touches[0].pageY - 333.5, e.touches[0].pageX - 187.5) * 180*4 / Math.PI;

    this.setState({
      x: rotation + this.state.oxset
    })
  }

  render() {
    const width = 375
    const ringWidth = 50
    const centerRadius = 50

    const group = <g className="c" mask="url(#level-mask)" transform={`rotate(${-this.state.x}, ${width / 2}, ${width / 2})`} />

    return (
      <div id="page">
        <div id="game">
          <svg width={width} height={width}>
            <defs>
              <mask id="level-mask">
                {this.state.levels.map((level, i) =>
                  <VictoryPie
                    className="level-mask"
                    key={i}
                    width={250} height={250}
                    origin={{x: width / 2, y: width / 2}}
                    labels={() => null}
                    standalone={false}
                    innerRadius={(this.state.levels.length - i - 1) * ringWidth + centerRadius}
                    data={level.map(p => p.width)}
                    style={{
                      data: {
                        fill: 'white', stroke: "black", strokeWidth: 2
                      }
                    }}
                  />
                )}
              </mask>
            </defs>

            {this.state.levels.map((level, i) =>
              <VictoryPie
                className="level"
                key={i}
                groupComponent={group}
                width={250} height={250}
                origin={{x: width / 2, y: width / 2}}
                labels={() => null}
                standalone={false}
                innerRadius={(this.state.levels.length - i - 1) * ringWidth + centerRadius}
                data={level.map(p => p.width)}
                colorScale={level.map(p => p.active ? 'black' : 'none')}
                style={{
                  data: {
                    stroke: "none"
                  }
                }}
              />
            )}

            <Circle
              events={{
                onClick: this.reset
              }}
              className="top"
              mask="url(#level-mask)"
              cx={width / 2} cy={width / 2} r={ringWidth}
              style={{
                fill: this.state.gameOver? 'red': 'black',
                strokeWidth: 2,
                stroke: 'white'
              }}
            />

            <VictoryAnimation duration={300} easing="polyOut" data={{offset: this.state.offset}}>
              {(data) => (
                <g transform={`translate(0, -${this.state.levels.length * ringWidth + 10 + 2}) rotate(${data.offset}, ${width / 2}, ${width / 2 + (this.state.levels.length * ringWidth + 10 + 2)})`}>
                  <Circle className="cursor" cx={width / 2} cy={width / 2} r={10} style={{fill: 'black'}}/>
                </g>
              )}
            </VictoryAnimation>
          </svg>
        </div>
        <div id="score">
          lv. {this.state.level}
          <br/>
          {this.state.score}
        </div>
      </div>
    )
  }
}

export default App;
