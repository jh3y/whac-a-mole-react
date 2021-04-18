import React, { useEffect, useRef, useState } from 'react'

const Timer = ({ time, interval = 1000, onEnd }) => {
  const [internalTime, setInternalTime] = useState(time)
  const timerRef = useRef(time)
  const timeRef = useRef(time)
  useEffect(() => {
    if (internalTime === 0 && onEnd) {
      onEnd()
    }
  }, [internalTime, onEnd])
  useEffect(() => {
    timerRef.current = setInterval(
      () => setInternalTime((timeRef.current -= interval)),
      interval
    )
    return () => {
      clearInterval(timerRef.current)
    }
  }, [interval])
  return <span>{`Time: ${internalTime}`}</span>
}

export default Timer