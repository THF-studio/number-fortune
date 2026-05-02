import { ELEM_ZH } from '../../logic/constants'
import type { AnalysisInput, Element } from '../../types'

interface NumberInputProps {
  value: AnalysisInput
  onChange: (input: AnalysisInput) => void
  onSubmit: () => void
}

const ELEMENTS: Element[] = ['Metal', 'Wood', 'Water', 'Fire', 'Earth']

export default function NumberInput({ value, onChange, onSubmit }: NumberInputProps) {
  function toggleElement(
    el: Element,
    target: 'favorElements' | 'avoidElements',
    opposite: 'favorElements' | 'avoidElements',
  ) {
    if (value[target].includes(el)) {
      onChange({ ...value, [target]: value[target].filter((e) => e !== el) })
    } else {
      onChange({
        ...value,
        [target]: [...value[target], el],
        [opposite]: value[opposite].filter((e) => e !== el),
      })
    }
  }

  return (
    <div className="flex flex-col items-center space-y-5">
      <div className="w-full max-w-sm">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          手机号码
        </label>
        <input
          type="text"
          inputMode="numeric"
          value={value.phone}
          onChange={(e) => onChange({ ...value, phone: e.target.value.replace(/\D/g, '') })}
          className="border border-gray-300 rounded px-3 py-2 w-full text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="e.g. 13812345678"
        />
      </div>

      <div className="w-full max-w-sm">
        <span className="block text-sm font-medium text-gray-700 mb-2">喜神</span>
        <div className="flex gap-2">
          {ELEMENTS.map((el) => (
            <button
              key={el}
              type="button"
              onClick={() => toggleElement(el, 'favorElements', 'avoidElements')}
              className={`flex-1 py-1 rounded border text-sm transition-colors ${
                value.favorElements.includes(el)
                  ? 'bg-green-500 text-white border-green-500'
                  : 'border-gray-300 text-gray-600 hover:border-green-300'
              }`}
            >
              {ELEM_ZH[el]}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-sm">
        <span className="block text-sm font-medium text-gray-700 mb-2">忌神</span>
        <div className="flex gap-2">
          {ELEMENTS.map((el) => (
            <button
              key={el}
              type="button"
              onClick={() => toggleElement(el, 'avoidElements', 'favorElements')}
              className={`flex-1 py-1 rounded border text-sm transition-colors ${
                value.avoidElements.includes(el)
                  ? 'bg-red-500 text-white border-red-500'
                  : 'border-gray-300 text-gray-600 hover:border-red-300'
              }`}
            >
              {ELEM_ZH[el]}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-sm">
        <button
          type="button"
          onClick={onSubmit}
          disabled={value.phone.trim() === ''}
          className="w-full max-w-sm bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          分析
        </button>
      </div>
    </div>
  )
}
