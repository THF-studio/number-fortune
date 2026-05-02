import { useEffect, useState } from 'react'
import { DIGIT_ELEM, ELEM_COLOR, ELEM_BG } from '../../logic/constants'
import type { LifePathResult } from '../../types'

// ── helpers ───────────────────────────────────────────────────────────────────

function useFadeIn(delay = 0) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return visible
}

// Blue palette matching numeric-energy "适合"
const BLUE = { text: '#1a5fa0', bg: '#e3f0fb', border: '#93c5e8' }

// ── personal year data ────────────────────────────────────────────────────────

interface PyEntry { state: string; geekLabel: string; action: string }

const PY: Record<number, PyEntry> = {
  1: { state: '新起点',  geekLabel: '系统重启',  action: '启动新项目，建立新架构，不要犹豫。' },
  2: { state: '蓄势期',  geekLabel: '数据同步',  action: '减速，建立连接，寻找合伙人，优化协作。' },
  3: { state: '能量扩张', geekLabel: '带宽扩张',  action: '发布产品，进行市场沟通，展示成果。' },
  4: { state: '建立基础', geekLabel: '底层加固',  action: '修复Bug，完善制度，处理税务，务实落地。' },
  5: { state: '变化突破', geekLabel: '版本迭代',  action: '寻求突破，尝试跨界，接受不确定性。' },
  6: { state: '责任调和', geekLabel: '环境优化',  action: '回归家庭，优化团队福利，提升审美。' },
  7: { state: '内省深化', geekLabel: '深度自检',  action: '闭关，研究底层技术，哲学思考，充电。' },
  8: { state: '收获丰盛', geekLabel: '性能爆发',  action: '商业收割，扩大规模，处理大额财务。' },
  9: { state: '圆满释放', geekLabel: '缓存清理',  action: '断舍离，终结旧项目，为下一个1号周期腾挪空间。' },
}

// ── missing digit advice ─────────────────────────────────────────────────────

const MISSING_ADVICE: Record<number, { trait: string; improve: string }> = {
  1: { trait: '领导力与独立性', improve: '主动承担项目主导权，练习独立决策，培养"先行动再优化"的习惯。' },
  2: { trait: '合作力与感知力', improve: '刻意练习倾听，在团队中扮演协调角色，关注他人情绪信号。' },
  3: { trait: '创意与表达力', improve: '坚持写作或创作输出，参加表达类活动，给自己"说出来"的机会。' },
  4: { trait: '踏实性与执行力', improve: '建立SOP流程，养成完成清单的习惯，避免频繁切换目标。' },
  5: { trait: '适应性与探索欲', improve: '定期尝试陌生事物，接受计划外的变动，把"不确定性"视为资产。' },
  6: { trait: '责任心与关怀力', improve: '主动承担家庭或团队责任，在照顾他人与照顾自己之间找到平衡。' },
  7: { trait: '深思力与内省力', improve: '养成冥想或写日记的习惯，为自己留出独处时间，深挖事物本质。' },
  8: { trait: '财务与权能感', improve: '建立清晰的财务目标与追踪系统，主动参与高层级决策，培养资源整合意识。' },
  9: { trait: '慈悲与宏观视野', improve: '扩大视野，关注更大议题，练习"放下"与"完成"，培养利他精神。' },
}

// ── 九宫格 ────────────────────────────────────────────────────────────────────
// Layout:  1 4 7
//          2 5 8
//          3 6 9
// col = Math.floor((n-1)/3), row = (n-1)%3

const CELL = 77
const GAP = 8
const GRID = CELL * 3 + GAP * 2

function gridPos(n: number) {
  const col = Math.floor((n - 1) / 3)
  const row = (n - 1) % 3
  return { cx: col * (CELL + GAP) + CELL / 2, cy: row * (CELL + GAP) + CELL / 2 }
}

const TALENT_LINES: number[][] = [
  [1, 4, 7], [2, 5, 8], [3, 6, 9],
  [1, 2, 3], [4, 5, 6], [7, 8, 9],
  [3, 5, 7], [1, 5, 9],
]

function NineGrid({ digitPresence }: { digitPresence: LifePathResult['digitPresence'] }) {
  const countOf = (n: number) => digitPresence.find(d => d.digit === n)?.count ?? 0
  const litLines = TALENT_LINES.filter(line => line.every(n => countOf(n) > 0))

  return (
    <div className="relative inline-block" style={{ width: GRID, height: GRID }}>
      <svg width={GRID} height={GRID} className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {litLines.map(line => {
          const pts = line.map(gridPos)
          return (
            <polyline
              key={line.join('-')}
              points={pts.map(p => `${p.cx},${p.cy}`).join(' ')}
              fill="none" stroke="#d97706" strokeWidth={2.5}
              strokeLinecap="round" strokeOpacity={0.7}
            />
          )
        })}
      </svg>

      {digitPresence.map(dp => {
        const { cx, cy } = gridPos(dp.digit)
        const x = cx - CELL / 2
        const y = cy - CELL / 2
        const elem = DIGIT_ELEM[dp.digit]
        const elemColor = ELEM_COLOR[elem]
        const elemBg = ELEM_BG[elem]
        const isPresent = dp.count > 0
        const isLifepath = dp.status === 'lifepath'
        const inLitLine = litLines.some(l => l.includes(dp.digit))

        const bg = isPresent ? elemBg : '#f9fafb'
        const border = isLifepath
          ? BLUE.border
          : inLitLine
            ? '#fbbf24'
            : isPresent
              ? elemColor + '66'
              : '#e5e7eb'
        const numColor = isPresent ? elemColor : '#d1d5db'
        const ring = isLifepath ? `0 0 0 2px ${BLUE.border}` : inLitLine ? '0 0 0 2px #fbbf2466' : 'none'

        return (
          <div
            key={dp.digit}
            className="absolute flex flex-col items-center justify-center rounded-lg border"
            style={{ left: x, top: y, width: CELL, height: CELL, background: bg, borderColor: border, zIndex: 2, boxShadow: ring }}
          >
            <span className="text-xl font-semibold leading-none" style={{ color: numColor }}>{dp.digit}</span>
            {isPresent && (
              <span className="text-sm mt-1" style={{ color: numColor }}>×{dp.count}</span>
            )}
            {isLifepath && (
              <span className="text-xs rounded px-1 mt-1" style={{ color: BLUE.text, background: BLUE.bg, border: `1px solid ${BLUE.border}` }}>灵数</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── LifePathCore (section 2) ──────────────────────────────────────────────────

export function LifePathCore({ result }: { result: LifePathResult }) {
  const { lifePathNumber, personalYear, reductionSteps, profile, digitPresence, missingDigits } = result
  const visible = useFadeIn(30)
  const numVisible = useFadeIn(200)
  const currentYear = new Date().getFullYear()
  const py = PY[personalYear]
  const litLines = TALENT_LINES.filter(line =>
    line.every(n => (digitPresence.find(d => d.digit === n)?.count ?? 0) > 0)
  )
  const [tableOpen, setTableOpen] = useState(false)

  return (
    <div
      className="space-y-4"
      style={{
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
      }}
    >
      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center gap-3 text-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center shadow-sm"
          style={{
            background: BLUE.bg,
            border: `2px solid ${BLUE.border}`,
            transition: 'opacity 0.5s ease-out',
            opacity: numVisible ? 1 : 0,
          }}
        >
          <span className="text-5xl font-bold" style={{ color: BLUE.text }}>{lifePathNumber}</span>
        </div>
        <div className="text-md font-semibold tracking-wide">{profile.label}</div>
        <p className="text-sm text-gray-700 leading-relaxed max-w-xs">{profile.traitSummary}</p>
        <div className="flex flex-wrap justify-center gap-2 mt-1">
          {profile.keywords.map(kw => (
            <span key={kw} className="px-2.5 py-0.5 rounded-md text-sm font-medium border"
              style={{ color: BLUE.text, background: BLUE.bg, borderColor: BLUE.border }}>
              {kw}
            </span>
          ))}
        </div>
        <div className="text-xs text-gray-400 mt-1">{reductionSteps.join(' → ')}</div>
      </div>

      {/* Matrix + Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">数字图谱</h2>
          <div className="flex justify-center">
            <NineGrid digitPresence={digitPresence} />
          </div>
          {litLines.length > 0 && (
            <div className="mt-3 text-sm text-amber-600 text-center">
              天赋线：{litLines.map(l => l.join('-')).join('、')}
            </div>
          )}
          {litLines.length === 0 && (
            <div className="mt-3 text-xs text-gray-400 text-center">暂无天赋线</div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <h2 className="text-lg font-semibold text-gray-800">深度洞察</h2>
          <InsightRow label="天赋才能" body={profile.talents[0]} />
          <InsightRow label="人生课题" body={profile.lifeLessons} truncate />
          <InsightRow label="适合方向" body={profile.suitableDirections} truncate />
          {profile.talents[1] && <InsightRow label="延伸才能" body={profile.talents[1]} />}
        </div>
      </div>

      {/* 性格与课题 */}
      <LifePathDetails result={result} />

      {/* 短板补强 */}
      {missingDigits.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">短板补强</h2>
          <p className="text-xs text-gray-400 mb-3">出生日期中缺失的数字代表待开发的潜能，有意识地补强可使能量更趋圆满。</p>
          <div className="space-y-2">
            {missingDigits.map(n => {
              const advice = MISSING_ADVICE[n]
              if (!advice) return null
              return (
                <div key={n} className="flex gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
                  <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 text-sm font-bold border border-orange-200 bg-orange-50 text-orange-600">{n}</div>
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-0.5">缺 {n} · {advice.trait}</div>
                    <p className="text-xs text-gray-500 leading-relaxed">{advice.improve}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 时空节拍 */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-baseline gap-2 mb-1">
          <h2 className="text-lg font-semibold text-gray-800">时空节拍</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4 leading-relaxed">
          生命灵数是你的硬件配置（你是谁），时空节拍是你的运行周期（你现在该做什么）。每9年一个循环，当前频率基于流年计算。
        </p>

        {/* Timeline */}
        <div className="flex items-end gap-1 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
            const active = n === personalYear
            return (
              <div key={n} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                {active && (
                  <div className="text-xs" style={{ color: BLUE.text }}>{currentYear}</div>
                )}
                <div
                  className="w-full rounded-md flex items-center justify-center text-sm font-semibold border transition-all"
                  style={{
                    height: active ? 40 : 32,
                    background: active ? BLUE.text : '#f9fafb',
                    color: active ? '#fff' : '#9ca3af',
                    borderColor: active ? BLUE.text : '#e5e7eb',
                    boxShadow: active ? `0 2px 8px ${BLUE.text}44` : 'none',
                  }}
                >
                  {n}
                </div>                
              </div>
            )
          })}
        </div>

        {/* Current year detail */}
        {py && (
          <div className="rounded-lg p-3 text-sm" style={{ background: BLUE.bg, border: `1px solid ${BLUE.border}` }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{py.geekLabel} · {currentYear}年 · {py.state}</span>
            </div>
            <p className="text-gray-700 leading-relaxed">{py.action}</p>
          </div>
        )}

        {/* Collapsible full instruction table */}
        <button
          type="button"
          onClick={() => setTableOpen(o => !o)}
          className="mt-3 flex items-center gap-1 text-sm hover:opacity-80 transition-opacity"
          style={{ color: BLUE.text }}
        >
          {tableOpen ? '收起完整指令集' : '查看完整指令集'}
          <svg className={`w-3 h-3 transition-transform duration-200 ${tableOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {tableOpen && (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-1 py-1.5 align-top font-normal text-gray-500 text-xs text-left w-[35px]">节拍</th>
                  <th className="border border-gray-200 px-2 py-1.5 align-top font-normal text-gray-500 text-xs text-left w-[75px]">状态</th>
                  <th className="border border-gray-200 px-2 py-1.5 align-top font-normal text-gray-500 text-xs text-left">极客指令</th>
                </tr>
              </thead>
              <tbody>
                {[1,2,3,4,5,6,7,8,9].map(n => {
                  const entry = PY[n]
                  const active = n === personalYear
                  return (
                    <tr key={n} style={{ background: active ? BLUE.bg : undefined }}>
                      <td className="border border-gray-200 px-2 py-1.5 align-top font-bold text-center" style={{ color: active ? BLUE.text : '#9ca3af' }}>{n}</td>
                      <td className="border border-gray-200 px-2 py-1.5 align-top font-medium" style={{ color: active ? BLUE.text : '#374151' }}>{entry?.state}</td>
                      <td className="border border-gray-200 px-2 py-1.5 align-top text-gray-600 leading-relaxed">{entry?.action}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function InsightRow({ label, body, truncate }: { label: string; body: string; truncate?: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const needsTruncate = truncate && body.length > 60
  const text = needsTruncate && !expanded ? body.slice(0, 60) + '…' : body
  return (
    <div className="pb-2">
      <div className="text-md font-semibold mb-1">{label}</div>
      <span className="text-sm text-gray-700 leading-relaxed">
        {text}
        {needsTruncate && (
          <button onClick={() => setExpanded(e => !e)} className="text-sm ml-1 align-baseline" style={{ color: BLUE.text }}>
            {expanded ? '收起' : '展开'}
          </button>
        )}
      </span>
    </div>
  )
}

// ── LifePathDetails (section 3) ───────────────────────────────────────────────

function Section({ label, body }: { label: string; body: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <p className="text-sm text-gray-700 leading-relaxed">{body}</p>
    </div>
  )
}

export function LifePathDetails({ result }: { result: LifePathResult }) {
  const { profile } = result
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
      <h2 className="text-lg font-semibold text-gray-800">性格与课题</h2>
      <Section label="性格画像" body={profile.personality} />
      <Section label="人生课题" body={profile.lifeLessons} />
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <div className="text-sm text-gray-500 mb-1">天赋才能</div>
        <ul className="list-disc pl-4 space-y-1">
          {profile.talents.map((t, i) => (
            <li key={i} className="text-sm text-gray-700 leading-relaxed">{t}</li>
          ))}
        </ul>
      </div>
      <Section label="适合方向" body={profile.suitableDirections} />
    </div>
  )
}

export default function LifePathReport({ result }: { result: LifePathResult }) {
  return (
    <div className="space-y-4">
      <LifePathCore result={result} />
      <LifePathDetails result={result} />
    </div>
  )
}
