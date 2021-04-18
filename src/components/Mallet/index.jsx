import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

const Mallet = () => {
  const cursorRef = useRef(null)
  useEffect(() => {
    const UPDATE = ({ x, y }) => {
      gsap.set(cursorRef.current, {
        '--x': x,
        '--y': y
      })
    }
    window.addEventListener('pointermove', UPDATE)
    return () => {
      window.removeEventListener('pointermove', UPDATE)
    }
  })
  return <div ref={cursorRef} className="mallet"></div>
}

export default Mallet