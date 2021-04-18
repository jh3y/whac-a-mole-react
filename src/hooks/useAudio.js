import { useEffect, useState } from 'react'
const useAudio = (src) => {
  const [audio, setAudio] = useState(null)
  useEffect(() => {
    setAudio(new Audio(src))
  }, [src])
  return {
    play: () => audio.play(),
    pause: () => audio.pause(),
    stop: () => {
      audio.pause()
      audio.currentTime = 0
    },
  }
}

export default useAudio
