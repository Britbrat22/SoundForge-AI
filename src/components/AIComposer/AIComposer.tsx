import React, { useState } from 'react'
import { Music, Zap, Download } from 'lucide-react'
import * as mm from '@magenta/music'

const AIComposer: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedNotes, setGeneratedNotes] = useState<any[]>([])
  const [style, setStyle] = useState('melody')
  const [tempo, setTempo] = useState(120)

  const generateMusic = async () => {
    setIsGenerating(true)
    
    try {
      // Initialize Magenta music generator
      const generator = new mm.MusicVAE(
        'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small'
      )
      
      await generator.initialize()
      
      // Generate 2 bars of music
      const generated = await generator.sample(1, undefined, undefined, 2)
      
      setGeneratedNotes(generated[0].notes || [])
    } catch (error) {
      console.error('Error generating music:', error)
      // Fallback: generate random notes
      const fallbackNotes = Array.from({ length: 8 }, (_, i) => ({
        pitch: 60 + Math.floor(Math.random() * 24),
        startTime: i * 0.5,
        endTime: (i + 1) * 0.5,
        velocity: 80
      }))
      setGeneratedNotes(fallbackNotes)
    } finally {
      setIsGenerating(false)
    }
  }

  const exportMidi = () => {
    if (generatedNotes.length === 0) return
    
    const sequence = {
      notes: generatedNotes,
      tempos: [{ time: 0, qpm: tempo }],
      totalTime: Math.max(...generatedNotes.map((n: any) => n.endTime))
    }
    
    // Create and download MIDI file
    const midi = mm.sequenceProtoToMidi(sequence)
    const blob = new Blob([midi], { type: 'audio/midi' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ai-generated-music.mid'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="block text-sm font-medium">Style</label>
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
        >
          <option value="melody">Melody</option>
          <option value="chord">Chord Progression</option>
          <option value="rhythm">Rhythm Pattern</option>
        </select>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium">Tempo: {tempo} BPM</label>
        <input
          type="range"
          min="60"
          max="180"
          value={tempo}
          onChange={(e) => setTempo(Number(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <button
        onClick={generateMusic}
        disabled={isGenerating}
        className="w-full flex items-center justify-center space-x-2 p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded transition-colors"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Zap size={16} />
            <span>Generate Music</span>
          </>
        )}
      </button>

      {generatedNotes.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm text-gray-400">
            Generated {generatedNotes.length} notes
          </div>
          <button
            onClick={exportMidi}
            className="w-full flex items-center justify-center space-x-2 p-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
          >
            <Download size={16} />
            <span>Export MIDI</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default AIComposer
