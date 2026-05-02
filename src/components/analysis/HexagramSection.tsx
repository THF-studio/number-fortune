import { useState } from 'react'
import { TG } from '../../logic/constants'
import type { AnalysisResult } from '../../types'

function CalcBox({ label, detail, result }: { label: string; detail: string; result: string }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-sm text-gray-700">{detail}</div>
      <div className="text-base font-semibold mt-1">{result}</div>
    </div>
  )
}


export default function HexagramSection({ result }: { result: AnalysisResult }) {
  const [open, setOpen] = useState(false)
  const { sum1, sum2, total, upperRem, lowerRem, movRem, movingLine, bodyIsUpper, group1, group2 } = result
  const bU = TG[upperRem]
  const bL = TG[lowerRem]
  const bodyLabel = bodyIsUpper ? '上卦' : '下卦'

  return (
    <div className="bg-white border border-gray-200 rounded-xl w-full overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4 text-left transition-colors"
      >
        <h2 className="text-lg font-semibold text-gray-800">卦象</h2>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <CalcBox
              label="上卦"
              detail={`${group1.join('')} → ${sum1} ÷ 8`}
              result={`余 ${upperRem === 8 && sum1 % 8 === 0 ? '0→8' : upperRem} → ${bU.name}`}
            />
            <CalcBox
              label="下卦"
              detail={`${group2.join('')} → ${sum2} ÷ 8`}
              result={`余 ${lowerRem === 8 && sum2 % 8 === 0 ? '0→8' : lowerRem} → ${bL.name}`}
            />
            <CalcBox
              label="动爻"
              detail={`${total} ÷ 6`}
              result={`余 ${movRem === 0 ? '0→6' : movRem} → 第${movingLine}爻 → ${bodyLabel}为体`}
            />
          </div>
        </div>
      )}
    </div>
  )
}
