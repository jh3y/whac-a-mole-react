import React, { Fragment, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import gsap from 'gsap'
import constants from '../../constants'
import CountDown from '../CountDown'
import FinishScreen from '../FinishScreen'
import StartScreen from '../StartScreen'
import Timer from '../Timer'
import Mole from '../Mole'
import Score from '../Score'
import HiScore from '../HiScore'
import Mallet from '../Mallet'
import generateMoles from '../../utils/generateMoles'
import usePersistentState from '../../hooks/usePersistentState'
import useAudio from '../../hooks/useAudio'

const Game = () => {
  const { play: playCount } = useAudio(
    'https://assets.codepen.io/605876/countdown-beep.mp3'
  )
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
  const { play: playThud } = useAudio(
    'https://assets.codepen.io/605876/thud--small.mp3',
    0.65
  )
  const { play: playWhistle } = useAudio(
    'https://assets.codepen.io/605876/whistle.mp3',
    0.65
  )
  const { play: playSparkle } = useAudio(
    'https://assets.codepen.io/605876/sparkle.mp3'
  )
  const { play: playClick } = useAudio(
    'https://assets.codepen.io/605876/click.mp3'
  )
  const [moles, setMoles] = useState(generateMoles())
  const [playing, setPlaying] = useState(false)
  const [starting, setStarting] = useState(false)
  const [finished, setFinished] = useState(false)
  const [score, setScore] = useState(0)
  const [newHighScore, setNewHighScore] = useState(false)
  const [muted, setMuted] = usePersistentState('whac-muted', true)
  const [highScore, setHighScore] = usePersistentState('whac-high-score', 0)
  const boardRef = useRef(null)

  const onWhack = (points, golden) => {
    gsap.to(boardRef.current, {
      yPercent: 2,
      repeat: 1,
      yoyo: true,
      duration: 0.05,
    })
    if (!muted) {
      playThud()
      if (golden) playSparkle()
      else {
        // Play random noise from selection
        ;[playWhack, playSqueak, playSqueakOut][Math.floor(Math.random() * 3)]()
      }
    }
    setScore(score + points)
  }

  const endGame = () => {
    if (!muted) {
      playClick()
      playWhistle()
    }
    if (score > parseInt(highScore, 10)) {
      if (!muted) {
        playCheer()
      }
      confetti()
      setHighScore(score)
      setNewHighScore(true)
    }
    setPlaying(false)
    setFinished(true)
  }

  const startPlaying = () => {
    if (!muted) playClick()
    setStarting(false)
    setPlaying(true)
    if (!muted) playWhistle()
  }

  const resetGame = () => {
    if (!muted) playClick()
    setScore(0)
    setNewHighScore(false)
    setMoles(generateMoles())
    setStarting(false)
    setPlaying(false)
    setFinished(false)
  }

  const startGame = () => {
    if (!muted) playClick()
    setScore(0)
    setNewHighScore(false)
    setMoles(generateMoles())
    setStarting(true)
    setFinished(false)
  }

  const toggleMute = () => {
    if (muted) playClick()
    setMuted(!muted)
  }

  return (
    <Fragment>
      <button
        className="mute-button icon-button"
        onClick={toggleMute}>
        {muted && (
          <Fragment>
            <span className="sr-only">Mute Audio</span>
            <svg
              className="icon"
              viewBox="0 0 512 512"
              width="100"
              title="Mute audio">
              <path d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zM461.64 256l45.64-45.64c6.3-6.3 6.3-16.52 0-22.82l-22.82-22.82c-6.3-6.3-16.52-6.3-22.82 0L416 210.36l-45.64-45.64c-6.3-6.3-16.52-6.3-22.82 0l-22.82 22.82c-6.3 6.3-6.3 16.52 0 22.82L370.36 256l-45.63 45.63c-6.3 6.3-6.3 16.52 0 22.82l22.82 22.82c6.3 6.3 16.52 6.3 22.82 0L416 301.64l45.64 45.64c6.3 6.3 16.52 6.3 22.82 0l22.82-22.82c6.3-6.3 6.3-16.52 0-22.82L461.64 256z" />
            </svg>
          </Fragment>
        )}
        {!muted && (
          <Fragment>
            <span className="sr-only">Audio On</span>
            <svg
              className="icon"
              viewBox="0 0 576 512"
              width="100"
              title="Audio On">
              <path d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zm233.32-51.08c-11.17-7.33-26.18-4.24-33.51 6.95-7.34 11.17-4.22 26.18 6.95 33.51 66.27 43.49 105.82 116.6 105.82 195.58 0 78.98-39.55 152.09-105.82 195.58-11.17 7.32-14.29 22.34-6.95 33.5 7.04 10.71 21.93 14.56 33.51 6.95C528.27 439.58 576 351.33 576 256S528.27 72.43 448.35 19.97zM480 256c0-63.53-32.06-121.94-85.77-156.24-11.19-7.14-26.03-3.82-33.12 7.46s-3.78 26.21 7.41 33.36C408.27 165.97 432 209.11 432 256s-23.73 90.03-63.48 115.42c-11.19 7.14-14.5 22.07-7.41 33.36 6.51 10.36 21.12 15.14 33.12 7.46C447.94 377.94 480 319.54 480 256zm-141.77-76.87c-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61C327.98 228.28 336 241.63 336 256c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88s-17.54-61.32-45.78-76.86z" />
            </svg>
          </Fragment>
        )}
      </button>
      {!starting && !playing && !finished && <HiScore value={highScore} />}
      {/* Fresh */}
      {!starting && !playing && !finished && (
        <StartScreen onStart={startGame} />
      )}
      {/* Starting */}
      {starting && (
        <CountDown
          onComplete={startPlaying}
          fx={() => {
            if (!muted) playCount()
          }}
        />
      )}
      {/* Playing */}
      {playing && (
        <Fragment>
          <button className="icon-button end-button" onClick={endGame}>
            <span className="sr-only">End Game</span>
            <svg
              className="icon"
              viewBox="0 0 352 512"
              width="100"
              title="times">
              <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
            </svg>
          </button>
          <Mallet />
          <div className="game-info">
            <Score value={score} />
            <Timer time={constants.TIME_LIMIT} onEnd={endGame} />
          </div>
        </Fragment>
      )}
      {/* Moles are always visible but not always active */}
      <main ref={boardRef}>
        <div className="moles">
          {moles.map(({ speed, delay, points }, id) => (
            <Mole
              key={id}
              onWhack={onWhack}
              speed={speed}
              active={playing}
              delay={delay}
              points={points}
              loading={id === 2 && !starting && !playing && !finished}
            />
          ))}
        </div>
      </main>
      {/* Finished */}
      {finished && (
        <FinishScreen
          onRestart={startGame}
          onReset={resetGame}
          newHigh={newHighScore}
          result={score}
        />
      )}
    </Fragment>
  )
}

export default Game
