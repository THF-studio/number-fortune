import { ELEM_ZH, ELEM_COLOR, ELEM_BG } from '../../logic/constants'
import type { AnalysisResult, DigitAnalysis } from '../../types'

interface DigitGridProps {
  result: AnalysisResult
}

const CARD = 'flex flex-col items-center justify-center flex-1 min-w-[44px] max-w-[80px] py-3 rounded-lg border'

function CardRow({ children, phantom }: { children: React.ReactNode; phantom?: boolean }) {
  return (
    <div className="flex justify-center gap-1.5 w-full">
      {children}
      {phantom && <div className={`${CARD} invisible`} aria-hidden />}
    </div>
  )
}

export default function DigitGrid({ result }: DigitGridProps) {
  const { digitAnalysis } = result
  const n = digitAnalysis.length
  const half = Math.ceil(n / 2)
  const rows = [digitAnalysis.slice(0, half), digitAnalysis.slice(half)].filter(r => r.length > 0)
  const needsPhantom = n % 2 !== 0

  function card(d: DigitAnalysis, i: number) {
    return (
      <div key={i} className={CARD} style={{ background: ELEM_BG[d.element], borderColor: '#e5e7eb' }}>
        <span className="text-xl font-bold" style={{ color: ELEM_COLOR[d.element] }}>{d.orig}</span>
        <span className="text-xs mt-0.5" style={{ color: ELEM_COLOR[d.element] }}>{ELEM_ZH[d.element]}</span>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">五行</h2>
      <div className="hidden sm:flex justify-center gap-1.5 w-full">
        {digitAnalysis.map((d, i) => card(d, i))}
      </div>
      <div className="flex flex-col gap-1.5 w-full sm:hidden">
        {rows.map((row, ri) => (
          <CardRow key={ri} phantom={ri === 1 && needsPhantom}>
            {row.map((d, i) => card(d, i))}
          </CardRow>
        ))}
      </div>
    </div>
  )
}
