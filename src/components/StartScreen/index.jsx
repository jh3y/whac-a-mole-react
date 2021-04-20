import React from 'react'
import T from 'prop-types'
import './start-screen.css'

const StartScreen = ({ onStart }) => (
  <div className="info-screen">
    <h1 className="title">
      <span>Whac</span>
      <span>a</span>
      <span>Mole</span>
    </h1>
    <button onClick={onStart}>Start Game</button>
  </div>
)

StartScreen.propTypes = {
  onStart: T.func.isRequired,
}

export default StartScreen
