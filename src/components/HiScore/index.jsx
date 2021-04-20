import React from 'react'
import T from 'prop-types'

import './hiscore.css'

const HiScore = ({ value }) => <span className="hiscore info__text">{`Hi Score: ${value}`}</span>
HiScore.propTypes = {
  value: T.number.isRequired,
}
export default HiScore
