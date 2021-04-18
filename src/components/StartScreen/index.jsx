import React from 'react'

const StartScreen = ({ onStart }) => {
  return (
    <div>
      <h1>Whac a Mole</h1>
      <button onClick={onStart}>Start Game</button>
    </div>
  )
}

export default StartScreen