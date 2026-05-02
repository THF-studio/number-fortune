import { ELEM_ZH, ELEM_COLOR, ELEM_BG } from '../../logic/constants'
import type { AnalysisResult, DigitAnalysis } from '../../types'

interface DigitGridProps {
  result: AnalysisResult
}

const CARD = 'flex flex-col items-center justify-center flex-1 min-w-[44px] max-w-[80px] py-3 rounded-lg border'

function elemStyle(d: DigitAnalysis) {
  return { background: ELEM_BG[d.element], borderColor: '#e5e7eb' }
}

function favorStyle(d: DigitAnalysis) {
  if (d.state === 'favor') return { background: '#dcfce7', borderColor: '#86efac', color: '#15803d' }
  if (d.state === 'avoid') return { background: '#fee2e2', borderColor: '#fca5a5', color: '#b91c1c' }
  return { background: '#f3f4f6', borderColor: '#e5e7eb', color: '#6b7280' }
}

function CardRow({ children, phantom }: { children: React.ReactNode; phantom?: boolean }) {
  return (
    <div className="flex justify-center gap-1.5 w-full">
      {children}
      {phantom && <div className={`${CARD} invisible`} aria-hidden />}
    </div>
  )
}

export default function DigitGrid({ result }: DigitGridProps) {
  const { digitAnalysis, favorCount, avoidCount, neutralCount } = result
  const hasPref = digitAnalysis.some(d => d.state !== 'neutral')
  const n = digitAnalysis.length
  const half = Math.ceil(n / 2)
  const rows = [digitAnalysis.slice(0, half), digitAnalysis.slice(half)].filter(r => r.length > 0)
  const needsPhantom = n % 2 !== 0

  function renderSection(styleOf: (d: DigitAnalysis) => React.CSSProperties, label: string) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">{label}</h2>
        <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:justify-center">
          {/* Desktop: single row */}
          <div className="hidden sm:flex justify-center gap-1.5 w-full">
            {digitAnalysis.map((d, i) => {
              const s = styleOf(d)
              return (
                <div key={i} className={CARD} style={s}>
                  <span className="text-xl font-bold" style={{ color: 'color' in s ? s.color as string : ELEM_COLOR[d.element] }}>{d.orig}</span>
                  <span className="text-xs mt-0.5" style={{ color: 'color' in s ? s.color as string : ELEM_COLOR[d.element] }}>{ELEM_ZH[d.element]}</span>
                </div>
              )
            })}
          </div>
          {/* Mobile: split into two equal rows */}
          <div className="flex flex-col gap-1.5 w-full sm:hidden">
            {rows.map((row, ri) => (
              <CardRow key={ri} phantom={ri === 1 && needsPhantom}>
                {row.map((d, i) => {
                  const s = styleOf(d)
                  return (
                    <div key={i} className={CARD} style={s}>
                      <span className="text-xl font-bold" style={{ color: 'color' in s ? s.color as string : ELEM_COLOR[d.element] }}>{d.orig}</span>
                      <span className="text-xs mt-0.5" style={{ color: 'color' in s ? s.color as string : ELEM_COLOR[d.element] }}>{ELEM_ZH[d.element]}</span>
                    </div>
                  )
                })}
              </CardRow>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 w-full space-y-5">
      {renderSection(elemStyle, '五行')}
      <div>
        {renderSection(favorStyle, '喜忌')}
        <div className="mt-3 text-xs text-gray-400">
          喜 × {favorCount} &nbsp;&nbsp; 忌 × {avoidCount} &nbsp;&nbsp; 中 × {neutralCount}
          {!hasPref && <span className="ml-2">（请先设定喜神忌神）</span>}
        </div>
      </div>
    </div>
  )
}
