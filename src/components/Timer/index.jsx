import T from 'prop-types'
import React, { Fragment, useEffect, useRef, useState } from 'react'

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
    timerRef.current = setInterval(() => {
      setInternalTime((timeRef.current -= interval))
    }, interval)
    return () => {
      clearInterval(timerRef.current)
    }
  }, [interval])
  return (
    <Fragment>
      <svg className="icon" viewBox="0 0 512 512" width="100" title="clock">
        <path d="M256,8C119,8,8,119,8,256S119,504,256,504,504,393,504,256,393,8,256,8Zm92.49,313h0l-20,25a16,16,0,0,1-22.49,2.5h0l-67-49.72a40,40,0,0,1-15-31.23V112a16,16,0,0,1,16-16h32a16,16,0,0,1,16,16V256l58,42.5A16,16,0,0,1,348.49,321Z" />
      </svg>
      <span className="info__text">{`${internalTime / 1000}s`}</span>
    </Fragment>
  )
}

Timer.defaultProps = {
  interval: 1000,
}

Timer.propTypes = {
  time: T.number.isRequired,
  interval: T.number,
  onEnd: T.func.isRequired,
}

export default Timer
