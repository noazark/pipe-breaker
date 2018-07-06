import {Component} from 'react'

export default class extends Component {
  constructor(props) {
    super(props)

    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)

    this.centerX = 187.5
    this.centerY = 333.5

    this.state = {
      lastValue: 0
    }
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

  componentDidMount() {
    if (!this.props.disabled) {
      this.enableTouch()
    }
  }

  componentWillUnmount() {
    this.disableTouch()
  }

  componentWillUpdate(nextProps) {
    if (!this.props.disabled && nextProps.disabled) {
      this.disableTouch()
    } else if (this.props.disabled && !nextProps.disabled) {
      this.enableTouch()
    }
  }

  getRotation(e) {
    return -Math.atan2(e.touches[0].pageY - this.centerY, e.touches[0].pageX - this.centerX) * 180 * 4 / Math.PI;
  }

  onTouchStart(e) {
    const value = this.getRotation(e)
    this.setState({lastValue: this.state.lastValue - value})
  }

  onTouchEnd(e) {
    this.setState({lastValue: this.props.value})
  }

  onTouchMove(e) {
    const value = this.getRotation(e)
    this.props.onChange(value + this.state.lastValue)
  }

  render () {
    return null
  }
}
