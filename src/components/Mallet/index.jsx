import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import malletSrc from '../../assets/mallet--optimized.svg'
import './mallet.css'

// Mallet that tracks users' cursor whilst game is playing.
const Mallet = () => {
  const cursorRef = useRef(null)
  const malletRef = useRef(null)
  const whackRef = useRef(null)
  useEffect(() => {
    gsap.set(malletRef.current, {
      xPercent: -23,
      yPercent: 10,
      rotate: 45,
    })
    // Create a timeline that can be restarted on pointerdown
    whackRef.current = gsap.timeline().fromTo(
      malletRef.current,
      {
        rotate: 45,
      },
      {
        rotate: 0,
        duration: 0.05,
        repeat: 1,
        yoyo: true,
      }
    )
    // Update function for CSS variable positioning
    const UPDATE = ({ x, y }) => {
      if (cursorRef.current)
        gsap.set(cursorRef.current, {
          '--x': x,
          '--y': y,
        })
    }
    UPDATE({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    // On whack, restart the GSAP timeline
    const WHACK = () => {
      whackRef.current.restart()
    }
    window.addEventListener('pointermove', UPDATE)
    window.addEventListener('pointerdown', WHACK)
    gsap.set(cursorRef.current, { display: 'block' })
    // Make sure we clean up after
    return () => {
      whackRef.current.kill()
      window.removeEventListener('pointerdown', WHACK)
      window.removeEventListener('pointermove', UPDATE)
    }
  })
  return (
    <div ref={cursorRef} className="mallet">
      <img src={malletSrc} ref={malletRef} alt="Mallet" />
    </div>
  )
}

export default Mallet
