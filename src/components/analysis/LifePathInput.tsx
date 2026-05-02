import { useRef } from 'react'
import type { LifePathDOBInput } from '../../types'

interface LifePathInputProps {
  value: LifePathDOBInput
  onChange: (v: LifePathDOBInput) => void
  onSubmit: () => void
}

export default function LifePathInput({ value, onChange, onSubmit }: LifePathInputProps) {
  const monthRef = useRef<HTMLInputElement>(null)
  const dayRef = useRef<HTMLInputElement>(null)
  const canSubmit = value.year.length === 4 && value.month.length > 0 && value.day.length > 0

  function handleYear(raw: string) {
    const v = raw.replace(/\D/g, '').slice(0, 4)
    onChange({ ...value, year: v })
    if (v.length === 4) monthRef.current?.focus()
  }

  function handleMonth(raw: string) {
    const v = raw.replace(/\D/g, '').slice(0, 2)
    onChange({ ...value, month: v })
    if (v.length === 2) dayRef.current?.focus()
  }

  function handleDay(raw: string) {
    const v = raw.replace(/\D/g, '').slice(0, 2)
    onChange({ ...value, day: v })
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && canSubmit) onSubmit()
  }

  const baseInput = 'border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-300 text-center'

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className="w-full max-w-sm flex flex-col gap-3">
        <label className="text-sm text-gray-700 font-medium">出生日期</label>
        <div className="flex items-center w-full gap-2">
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder="YYYY"
            value={value.year}
            onChange={e => handleYear(e.target.value)}
            onKeyDown={handleKey}
            className={`flex-[2] min-w-0 ${baseInput}`}
          />
          <span className="text-gray-400 shrink-0">/</span>
          <input
            ref={monthRef}
            type="text"
            inputMode="numeric"
            maxLength={2}
            placeholder="MM"
            value={value.month}
            onChange={e => handleMonth(e.target.value)}
            onKeyDown={handleKey}
            className={`flex-1 min-w-0 ${baseInput}`}
          />
          <span className="text-gray-400 shrink-0">/</span>
          <input
            ref={dayRef}
            type="text"
            inputMode="numeric"
            maxLength={2}
            placeholder="DD"
            value={value.day}
            onChange={e => handleDay(e.target.value)}
            onKeyDown={handleKey}
            className={`flex-1 min-w-0 ${baseInput}`}
          />
        </div>
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="w-full mt-2 py-2 rounded bg-blue-600 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          分析
        </button>
      </div>
    </div>
  )
}
