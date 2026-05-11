import { useEffect, useRef, useState } from 'react'
import { scoreLabel } from '../../logic/scoring'
import type { AnalysisResult, FocusArea } from '../../types'

const FOCUS_TITLE: Record<FocusArea, string> = {
  career: '事业运', romance: '感情运', health: '健康运', wealth: '财运', overall: '综合运',
}

const ALL_FOCUS: FocusArea[] = ['career', 'romance', 'health', 'wealth', 'overall']

function scoreStyle(s: number) {
  if (s >= 75) return { color: '#15803d', bg: '#dcfce7' }
  if (s >= 55) return { color: '#1a5fa0', bg: '#e3f0fb' }
  return { color: '#c5221f', bg: '#fdecea' }
}

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0)
  const raf = useRef<number>(0)
  useEffect(() => {
    let start: number | null = null
    function step(ts: number) {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setValue(Math.round(progress * target))
      if (progress < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])
  return value
}

function AnimatedBar({ score, color }: { score: number; color: string }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 50)
    return () => clearTimeout(t)
  }, [score])
  return (
    <div className="h-1.5 rounded bg-gray-200 mt-2 mb-2 overflow-hidden">
      <div
        className="h-full rounded transition-all"
        style={{ width: `${width}%`, background: color, transitionDuration: '900ms', transitionTimingFunction: 'ease-out' }}
      />
    </div>
  )
}

function ScoreCard({ focus, score }: { focus: FocusArea; score: number }) {
  const st = scoreStyle(score)
  const animated = useCountUp(score)
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="text-xs text-gray-500 mb-1.5">{FOCUS_TITLE[focus]}</div>
      <div className="text-3xl font-semibold" style={{ color: st.color }}>{animated}</div>
      <AnimatedBar score={score} color={st.color} />
      <span className="inline-block px-2.5 py-0.5 rounded-md text-sm" style={{ color: st.color }}>
        {scoreLabel(score)}
      </span>
    </div>
  )
}

export function ScoreOverview({ result }: { result: AnalysisResult }) {
  const { focusScores, overallScore } = result
  const os = scoreStyle(overallScore)
  const animatedOverall = useCountUp(overallScore)

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">评分</h2>

      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
        {ALL_FOCUS.map(f => (
          <ScoreCard key={f} focus={f} score={focusScores[f]} />
        ))}
      </div>

      <div className="border-t border-gray-200 mt-4 pt-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-sm text-gray-700 mb-1">综合评分</div>
          <div className="text-5xl font-semibold leading-none" style={{ color: os.color }}>{animatedOverall}</div>
          <AnimatedBar score={overallScore} color={os.color} />
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-700 mb-2">综合建议</div>
          <span className="inline-block px-7 py-2.5 rounded-lg text-xl font-semibold"
            style={{ background: os.bg, color: os.color }}>
            {scoreLabel(overallScore)}
          </span>
        </div>
      </div>

      <div className="mt-5 flex gap-3 flex-wrap">
        <span className="px-2.5 py-0.5 rounded-lg text-xs bg-green-100 text-green-800">推荐 ≥ 75</span>
        <span className="px-2.5 py-0.5 rounded-lg text-xs bg-blue-100 text-blue-800">适合 55–74</span>
        <span className="px-2.5 py-0.5 rounded-lg text-xs bg-red-100 text-red-800">不适合 &lt; 55</span>
      </div>
    </div>
  )
}

function stripHexName(text: string) {
  return text.replace(/[本互之]卦【[^】]*】/g, '')
}

function FocusTextSection({ focus, result }: { focus: FocusArea; result: AnalysisResult }) {
  const ft = result.focusText[focus]
  return (
    <div className="mb-2.5 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="text-md font-semibold mb-2">{ft.title}</div>
      {([['本卦', ft.base], ['互卦', ft.mutual], ['之卦', ft.changed]] as [string, string][]).map(
        ([label, text]) => (
          <div key={label} className="mb-4">
            <div className="text-sm text-gray-500 mb-0.5">{label}</div>
            <div className="text-sm text-gray-700 leading-relaxed">{stripHexName(text)}</div>
          </div>
        )
      )}
    </div>
  )
}

export function ScoreDetails({ result }: { result: AnalysisResult }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">运程</h2>
      {ALL_FOCUS.map(f => (
        <FocusTextSection key={f} focus={f} result={result} />
      ))}
    </div>
  )
}

export default function ScoreSection({ result }: { result: AnalysisResult }) {
  return (
    <div className="space-y-4">
      <ScoreOverview result={result} />
      <ScoreDetails result={result} />
    </div>
  )
}
