import React, { useState } from 'react'
import { Sliders, Plus, Trash2 } from 'lucide-react'

interface Effect {
  id: string
  type: 'reverb' | 'delay' | 'distortion' | 'compressor' | 'eq'
  name: string
  params: Record<string, number>
}

const EffectsRack: React.FC = () => {
  const [effects, setEffects] = useState<Effect[]>([
    {
      id: '1',
      type: 'reverb',
      name: 'Reverb',
      params: { room: 0.5, damp: 0.3, wet: 0.4 }
    },
    {
      id: '2',
      type: 'delay',
      name: 'Delay',
      params: { time: 0.3, feedback: 0.2, wet: 0.3 }
    }
  ])

  const effectTypes = [
    { type: 'reverb', name: 'Reverb' },
    { type: 'delay', name: 'Delay' },
    { type: 'distortion', name: 'Distortion' },
    { type: 'compressor', name: 'Compressor' },
    { type: 'eq', name: 'Equalizer' }
  ]

  const addEffect = (type: string) => {
    const newEffect: Effect = {
      id: Date.now().toString(),
      type: type as Effect['type'],
      name: effectTypes.find(e => e.type === type)?.name || 'Effect',
      params: getDefaultParams(type as Effect['type'])
    }
    setEffects([...effects, newEffect])
  }

  const getDefaultParams = (type: Effect['type']) => {
    switch (type) {
      case 'reverb':
        return { room: 0.5, damp: 0.3, wet: 0.4 }
      case 'delay':
        return { time: 0.3, feedback: 0.2, wet: 0.3 }
      case 'distortion':
        return { gain: 0.5, tone: 0.5 }
      case 'compressor':
        return { threshold: -20, ratio: 4, attack: 0.1, release: 0.3 }
      case 'eq':
        return { low: 0, mid: 0, high: 0 }
      default:
        return {}
    }
  }

  const removeEffect = (id: string) => {
    setEffects(effects.filter(e => e.id !== id))
  }

  const updateParam = (effectId: string, param: string, value: number) => {
    setEffects(effects.map(effect => 
      effect.id === effectId 
        ? { ...effect, params: { ...effect.params, [param]: value } }
        : effect
    ))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Effects Rack</h3>
        <select
          onChange={(e) => {
            if (e.target.value) {
              addEffect(e.target.value)
              e.target.value = ''
            }
          }}
          className="text-sm p-1 bg-gray-700 border border-gray-600 rounded"
        >
          <option value="">Add Effect</option>
          {effectTypes.map(type => (
            <option key={type.type} value={type.type}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {effects.map(effect => (
          <div key={effect.id} className="bg-gray-700 rounded p-3">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium flex items-center space-x-2">
                <Sliders size={16} />
                <span>{effect.name}</span>
              </h4>
              <button
                onClick={() => removeEffect(effect.id)}
                className="p-1 text-red-400 hover:text-red-300"
              >
                <Trash2 size={14} />
              </button>
            </div>
            
            <div className="space-y-2">
              {Object.entries(effect.params).map(([param, value]) => (
                <div key={param} className="space-y-1">
                  <label className="text-xs text-gray-400 capitalize">
                    {param}: {value.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={value}
                    onChange={(e) => updateParam(effect.id, param, Number(e.target.value))}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {effects.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <Sliders size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No effects added</p>
          <p className="text-xs">Select an effect from the dropdown above</p>
        </div>
      )}
    </div>
  )
}

export default EffectsRack
