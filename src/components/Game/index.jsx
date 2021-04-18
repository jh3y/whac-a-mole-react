import React, { Fragment, useState } from 'react'
import constants from '../../constants'
import StartScreen from '../StartScreen'
import Timer from '../Timer'
import Mole from '../Mole'
import Mallet from '../Mallet'
import generateMoles from '../../utils/generateMoles'
import usePersistentState from '../../hooks/usePersistentState'
import useAudio from '../../hooks/useAudio'

const Board = ({ children }) => <main>{children}</main>

const Score = ({ value }) => <span>{`Score: ${value}`}</span>

const HighScore = ({ value }) => <span>{`Hi Score: ${value}`}</span>

const Result = ({ value }) => <span>{`Result: ${value}`}</span>

const Game = () => {
  const { play: playWhack } = useAudio(
    'https://assets.codepen.io/605876/pop.mp3'
  )
  const [moles, setMoles] = useState(generateMoles())
  const [playing, setPlaying] = useState(false)
  const [finished, setFinished] = useState(false)
  const [newHighScore, setNewHighScore] = useState(false)
  const [score, setScore] = useState(0)
  const [muted, setMuted] = usePersistentState('whac-muted', true)
  const [highScore, setHighScore] = usePersistentState('whac-high-score', 0)

  const onWhack = (points) => {
    if (score + points > highScore) {
      setNewHighScore(true)
      setHighScore(score + points)
    }
    if (muted === 'false') playWhack()
    setScore(score + points)
  }

  const endGame = () => {
    if (score > parseInt(highScore, 10)) setHighScore(score)
    setPlaying(false)
    setFinished(true)
  }

  const startGame = () => {
    setScore(0)
    setNewHighScore(false)
    setMoles(generateMoles())
    setPlaying(true)
    setFinished(false)
  }

  return (
    <Fragment>
      <button className="mute-button" onClick={() => setMuted(!muted)}>Toggle Mute</button>
      {/* Fresh */}
      {!playing && !finished && <StartScreen onStart={startGame} />}
      <Board>
        {/* Playing */}
        {true && (
          <Fragment>
            <Mallet/>
            <button className="end-button" onClick={endGame}>End Game</button>
            <div className="game-info">
              <Score value={score} />
              <Timer time={constants.TIME_LIMIT} onEnd={endGame} />
            </div>
            <div className="moles">
              {moles.map(({ speed, delay, points }, id) => (
                <Mole
                  key={id}
                  onWhack={onWhack}
                  speed={speed}
                  delay={delay}
                  points={points}
                />
              ))}
            </div>
          </Fragment>
        )}
        {/* Finished */}
        {false && (
          <Fragment>
            <Result value={score} />
            {newHighScore && <span>NEW</span>}
            <HighScore value={highScore} />
            <button onClick={startGame}>Start Again</button>
          </Fragment>
        )}
      </Board>
    </Fragment>
  )
}

export default Game
