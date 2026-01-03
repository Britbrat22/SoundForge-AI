import { useState, useEffect, useRef } from 'react'
import * as Tone from 'tone'

export const useAudioEngine = () => {
  const [isInitialized, setIsInitialized] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const transportRef = useRef<Tone.Transport | null>(null)

  useEffect(() => {
    const initAudio = async () => {
      try {
        // Initialize Web Audio API
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const masterGain = audioContext.createGain()
        masterGain.connect(audioContext.destination)
        masterGain.gain.value = 0.8

        audioContextRef.current = audioContext
        masterGainRef.current = masterGain
        transportRef.current = Tone.Transport

        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize audio engine:', error)
      }
    }

    initAudio()

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const play = async () => {
    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume()
    }
    transportRef.current?.start()
  }

  const pause = () => {
    transportRef.current?.pause()
  }

  const stop = () => {
    transportRef.current?.stop()
  }

  return {
    audioContext: audioContextRef.current,
    masterGain: masterGainRef.current,
    isInitialized,
    play,
    pause,
    stop
  }
}
