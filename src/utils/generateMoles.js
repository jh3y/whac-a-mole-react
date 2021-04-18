import gsap from 'gsap'
import constants from '../constants'

const generateMoles = () =>
  new Array(constants.MOLES).fill().map(() => ({
    speed: gsap.utils.random(0.5, 1),
    delay: gsap.utils.random(0.5, 4),
    points: constants.MOLE_SCORE,
  }))

export default generateMoles