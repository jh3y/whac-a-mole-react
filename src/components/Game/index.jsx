import React, { Fragment, useRef, useState } from 'react'
import gsap from 'gsap'
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
  const { play: playSqueak } = useAudio(
    'https://assets.codepen.io/605876/squeak-in.mp3'
  )
  const { play: playSqueakOut } = useAudio(
    'https://assets.codepen.io/605876/squeak-out.mp3'
  )
  const { play: playCheer } = useAudio(
    'https://assets.codepen.io/605876/kids-cheering.mp3'
  )
  const [moles, setMoles] = useState(generateMoles())
  const [playing, setPlaying] = useState(false)
  const [finished, setFinished] = useState(false)
  const [newHighScore, setNewHighScore] = useState(false)
  const [score, setScore] = useState(0)
  const [muted, setMuted] = usePersistentState('whac-muted', true)
  const [highScore, setHighScore] = usePersistentState('whac-high-score', 0)
  const boardRef = useRef(null)

  const onWhack = (points, golden) => {
    if (score + points > highScore) {
      setNewHighScore(true)
      setHighScore(score + points)
    }
    gsap.to(boardRef.current, {
      yPercent: 2,
      repeat: 1,
      yoyo: true,
      duration: 0.05,
    })
    if (muted === 'false' || muted === false) {
      if (golden) playCheer()
      else {
        // Play random noise from selection
        [playWhack, playSqueak, playSqueakOut][Math.floor(Math.random() * 3)]()
      }
    }
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
      <button className="mute-button" onClick={() => setMuted(!muted)}>
        Toggle Mute
      </button>
      {/* Fresh */}
      {!playing && !finished && <StartScreen onStart={startGame} />}
      {/* Playing */}
      {true && (
        <Fragment>
          <button className="end-button" onClick={endGame}>
            End Game
          </button>
          <Mallet />
          <div className="game-info">
            <Score value={score} />
            <Timer time={constants.TIME_LIMIT} onEnd={endGame} />
          </div>
          <main ref={boardRef}>
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
          </main>
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
    </Fragment>
  )
}

export default Game
