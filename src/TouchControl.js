import React, {Component} from 'react'

export default class extends Component {
  constructor(props) {
    super(props)

    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)

    this.centerX = 187.5
    this.centerY = 333.5

    this.state = {
      oxset: 0
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
    this.enableTouch()
  }

  componentWillUnmount() {
    this.disableTouch()
  }

  componentWillUpdate(nextProps) {
    if (!this.props.disabled && nextProps.disabled) {
      this.disableTouch()
    }
  }

  getRotation(e) {
    return -Math.atan2(e.touches[0].pageY - this.centerY, e.touches[0].pageX - this.centerX) * 180 * 4 / Math.PI;
  }

  onTouchStart(e) {
    const rotation = this.getRotation(e)
    this.setState({oxset: this.state.oxset - rotation})
  }

  onTouchEnd(e) {
    this.setState({oxset: this.state.x})
  }

  onTouchMove(e) {
    const rotation = this.getRotation(e)

    this.props.onChange(rotation + this.state.oxset)
  }

  render () {
    return null
  }
}
