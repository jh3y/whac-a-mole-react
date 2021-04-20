import { useEffect, useState } from 'react'

const useAudio = (src, volume = 1) => {
  const [audio, setAudio] = useState(null)
  useEffect(() => {
    const AUDIO = new Audio(src)
    AUDIO.volume = volume
    setAudio(AUDIO)
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
