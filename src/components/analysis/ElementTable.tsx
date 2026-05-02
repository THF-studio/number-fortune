import { TG, ELEM_ZH, ELEM_COLOR, ELEM_BG } from '../../logic/constants'
import type { AnalysisResult, HexagramLayer } from '../../types'

interface ElementTableProps {
  result: AnalysisResult
}

function TrigramGlyph({ trigKey }: { trigKey: number }) {
  const lines = TG[trigKey].lines
  const W = 28, H = 22
  const lineH = 2, gap = 4
  const totalRows = 3
  const totalH = totalRows * lineH + (totalRows - 1) * gap
  const startY = (H - totalH) / 2

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="inline-block">
      {[...lines].reverse().map((yang, i) => {
        const y = startY + i * (lineH + gap)
        if (yang === 1) {
          return <rect key={i} x={2} y={y} width={W - 4} height={lineH} rx={1} fill="currentColor" />
        }
        const seg = (W - 4 - 6) / 2
        return (
          <g key={i}>
            <rect x={2}           y={y} width={seg} height={lineH} rx={1} fill="currentColor" />
            <rect x={2 + seg + 6} y={y} width={seg} height={lineH} rx={1} fill="currentColor" />
          </g>
        )
      })}
    </svg>
  )
}

function JxBadge({ label, jx }: { label: string; jx: string }) {
  const good = jx === '吉'
  return (
    <span className={`inline-block px-3 py-0.5 rounded-md font-semibold text-sm border ${
      good ? 'bg-green-200 text-green-900 border-green-300' : 'bg-red-200 text-red-900 border-red-300'
    }`}>
      {label}
    </span>
  )
}

function ColHeader({ layer, h }: { layer: string; h: HexagramLayer }) {
  return (
    <th className="bg-gray-50 font-normal text-center p-2 border border-gray-200 text-gray-500">
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-gray-400">{layer}</span>
        <span className="text-xs font-medium text-gray-700">{h.hexName}</span>
      </div>
    </th>
  )
}

function TrigCell({ trigKey }: { trigKey: number }) {
  const t = TG[trigKey]
  const color = ELEM_COLOR[t.element]
  const bg = ELEM_BG[t.element]
  return (
    <td className="p-3 border border-gray-200 text-center align-middle bg-white">
      <TrigramGlyph trigKey={trigKey} />
      <br />
      <span
        className="m-1 inline-block px-2.5 py-0.5 rounded-md text-sm font-semibold border"
        style={{ color, background: bg, borderColor: color + '16' }}
      >
        {ELEM_ZH[t.element]}
      </span>
      <br />
      <span className="text-gray-500 text-sm">{t.name}</span>
    </td>
  )
}

export default function ElementTable({ result }: ElementTableProps) {
  const { base, mutual, changed, movingLine } = result
  const bodyIsUpper = movingLine <= 3
  const cols: { layer: string; h: HexagramLayer }[] = [
    { layer: '本卦', h: base },
    { layer: '互卦', h: mutual },
    { layer: '之卦', h: changed },
  ]
  const bodyLabel = bodyIsUpper ? '上卦' : '下卦'
  const useLabel  = bodyIsUpper ? '下卦' : '上卦'

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">吉凶</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm" style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th className="bg-gray-50 text-left p-2 border border-gray-200 w-20 font-semibold text-xs"></th>
              {cols.map(c => <ColHeader key={c.layer} layer={c.layer} h={c.h} />)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="bg-gray-50 p-2 border border-gray-200 text-gray-500 whitespace-nowrap">上卦
                {!bodyIsUpper && (
                  <span className="ml-1 inline-block px-1 py-0 rounded text-orange-700 bg-orange-50 border border-orange-300 text-[10px] font-semibold leading-tight">用</span>
                )}
              </td>
              {cols.map(c => <TrigCell key={c.layer} trigKey={c.h.upperKey} />)}
            </tr>
            <tr>
              <td className="bg-gray-50 p-2 border border-gray-200 text-gray-500 whitespace-nowrap">下卦
                {bodyIsUpper && (
                  <span className="ml-1 inline-block px-1 py-0 rounded text-orange-700 bg-orange-50 border border-orange-300 text-[10px] font-semibold leading-tight">用</span>
                )}
              </td>
              {cols.map(c => <TrigCell key={c.layer} trigKey={c.h.lowerKey} />)}
            </tr>
            <tr>
              <td className="bg-gray-50 p-2 border border-gray-200 text-gray-500 whitespace-nowrap">体用关系</td>
              {cols.map(c => (
                <td key={c.layer} className="p-3 border border-gray-200 text-center bg-white">
                  <span className="font-semibold text-md">{c.h.info.rel}</span><br />
                  <span className="text-gray-500 text-xs">{c.h.info.desc}</span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="bg-gray-50 p-2 border border-gray-200 text-gray-500 whitespace-nowrap">吉凶</td>
              {cols.map(c => (
                <td key={c.layer} className="p-3 border border-gray-200 text-center bg-white">
                  <JxBadge label={c.h.info.jxLabel} jx={c.h.info.jx} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-xs text-gray-400">
        动爻第{movingLine}爻 → {bodyLabel}为体，{useLabel}为用 ·{' '}
        <span className="inline-block px-1 py-0 rounded text-orange-700 bg-orange-50 border border-orange-300 text-[10px] font-semibold">用</span>
        {' '}标签标示用卦位置
      </div>
    </div>
  )
}
