import { TG, ELEM_ZH } from './constants'
import type { FocusArea, FocusSectionText, HexagramLayer, JiXiongLabel } from '../types'

const JX_SCORE: Record<JiXiongLabel, number> = { '吉': 82, '凶': 30 }

// Score each relationship type directly — removes dependency on 喜忌 inputs
const REL_SCORE: Record<string, number> = {
  '生入': 92, '比旺': 80, '克出': 68, '生出': 48, '克入': 32,
}

// Per-focus layer weights: [base, mutual, changed]
const LAYER_WEIGHTS: Record<Exclude<FocusArea, 'overall'>, [number, number, number]> = {
  career:  [0.50, 0.30, 0.20],
  romance: [0.35, 0.40, 0.25],
  health:  [0.30, 0.35, 0.35],
  wealth:  [0.50, 0.25, 0.25],
}

export function scoreLabel(score: number): string {
  if (score >= 75) return '推荐'
  if (score >= 55) return '适合'
  return '不适合'
}

function calcBaseScore(
  base: HexagramLayer,
  mutual: HexagramLayer,
  changed: HexagramLayer,
  focus: Exclude<FocusArea, 'overall'>,
): number {
  const [w0, w1, w2] = LAYER_WEIGHTS[focus]
  const score =
    w0 * (REL_SCORE[base.info.rel] ?? 55) +
    w1 * (REL_SCORE[mutual.info.rel] ?? 55) +
    w2 * (REL_SCORE[changed.info.rel] ?? 55)
  return Math.max(20, Math.min(98, Math.round(score)))
}

export function focusScore(
  base: HexagramLayer,
  mutual: HexagramLayer,
  changed: HexagramLayer,
  favorCount: number,
  avoidCount: number,
  N: number,
  focus: FocusArea,
): number {
  if (focus === 'overall') {
    const sub: Exclude<FocusArea, 'overall'>[] = ['career', 'romance', 'health', 'wealth']
    const avg = sub.reduce((sum, f) => sum + calcBaseScore(base, mutual, changed, f), 0) / sub.length
    return Math.max(20, Math.min(98, Math.round(avg)))
  }
  return calcBaseScore(base, mutual, changed, focus)
}

export function focusAnalysis(
  base: HexagramLayer,
  mutual: HexagramLayer,
  changed: HexagramLayer,
): Record<FocusArea, number> {
  const areas: FocusArea[] = ['career', 'romance', 'health', 'wealth', 'overall']
  const result = {} as Record<FocusArea, number>
  for (const f of areas) {
    result[f] = focusScore(base, mutual, changed, 0, 0, 1, f)
  }
  return result
}

export function buildAllFocusText(
  base: HexagramLayer,
  mutual: HexagramLayer,
  changed: HexagramLayer,
  favorCount: number,
  avoidCount: number,
): Record<FocusArea, FocusSectionText> {
  const buZh = ELEM_ZH[TG[base.upperKey].element]
  const blZh = ELEM_ZH[TG[base.lowerKey].element]
  const elemOk = favorCount >= avoidCount
  const b = base.info.jx === '吉'
  const m = mutual.info.jx === '吉'
  const c = changed.info.jx === '吉'

  function make(
    title: string,
    baseTxt: [string, string],
    mutualTxt: [string, string],
    changedTxt: [string, string],
    elemTxt: [string, string],
  ): FocusSectionText {
    return {
      title,
      base:    `本卦【${base.hexName}】上卦属${buZh}、下卦属${blZh}，体用关系为${base.info.rel}（${base.info.desc}），判定${base.info.jxLabel}。${b ? baseTxt[0] : baseTxt[1]}`,
      mutual:  `互卦【${mutual.hexName}】体用关系为${mutual.info.rel}，判定${mutual.info.jxLabel}。${m ? mutualTxt[0] : mutualTxt[1]}`,
      changed: `之卦【${changed.hexName}】体用关系为${changed.info.rel}，判定${changed.info.jxLabel}。${c ? changedTxt[0] : changedTxt[1]}`,
      elem:    `喜神占${favorCount}位，忌神占${avoidCount}位。${elemOk ? elemTxt[0] : elemTxt[1]}`,
    }
  }

  const career = make('事业运',
    ['职场基础能量稳固，有利建立良好口碑与人际信任，上下级关系顺畅。', '职场根基存在五行压力，建议主动维护同事与上级关系，避免摩擦扩大。'],
    ['内在竞争力强，能持续突破瓶颈，晋升与加薪机会较多。', '内在驱动力不稳，容易产生职场倦怠，建议定期评估职业发展方向。'],
    ['事业发展结果理想，收入与职位有望稳步提升。', '事业结果层面存在挑战，关键决策时建议多方咨询，避免冒进。'],
    ['五行能量配合事业发展，有利工作效率与职场表现。', '忌神偏多，建议主动提升核心技能，以实力弥补五行阻力。'],
  )

  const romance = make('感情运',
    ['感情基础能量稳固，缘分较强，双方吸引力与包容度和谐，有利感情稳定发展。', '感情根基存在五行阻力，建议主动沟通，避免误解积累，化解情感摩擦。'],
    ['感情过程顺畅，双方互动积极，有利增进感情深度与默契。', '感情中段易遇波折，建议保持耐心，多一份体谅，共同度过考验期。'],
    ['感情走向良好，长期稳定性强，有望迈向更深层承诺。', '感情结果层面需主动经营，不宜消极等待，宜积极表达心意。'],
    ['五行能量配合感情运势，有利桃花与婚缘发展。', '忌神偏重，建议通过提升个人魅力与生活品质来弥补五行不足。'],
  )

  const health = make('健康运',
    ['身体基础能量稳健，体质较好，日常保健效果较佳。', '身体根基存在五行失调，建议注意作息规律，避免过度劳累或情绪积压。'],
    ['自我修复力强，即使经历压力或疾病也能较快恢复。', '内在调节能量偏弱，建议定期检查，提早预防慢性健康问题。'],
    ['长期健康走势积极，维持良好习惯将有明显成效。', '健康结果层面需警惕，建议提前做好健康管理，不宜拖延就诊。'],
    ['五行能量对健康运势有正面支持，身心状态较为平衡。', '忌神较多，建议加强运动与营养均衡。'],
  )

  const wealth = make('财运',
    ['财运基础稳固，正财收入稳定，适合稳健型理财规划。', '财运根基存在五行摩擦，建议保守管理支出，避免冲动投资或借贷风险。'],
    ['财富积累动力强，偏财与投资机会较多，把握时机可有额外收益。', '财富内在能量不稳，偏财运较弱，不宜轻易尝试高风险投资。'],
    ['长期财运向好，坚持储蓄与规划将获得明显财富积累。', '财富结果层面需谨慎，建议分散风险，避免单一渠道过度集中。'],
    ['五行能量配合财运，有利正财收入与资产保值。', '忌神偏重，建议量入为出，加强财务规律性管理。'],
  )

  const overall: FocusSectionText = {
    title: '综合运',
    base:    `本卦【${base.hexName}】体用关系为${base.info.rel}（${base.info.desc}），判定${base.info.jxLabel}。${b ? '整体能量格局稳固，各方面运势基础良好，适合积极推进重要事项。' : '整体基础层面存在阻力，建议审慎评估各项计划，以稳健为主。'}`,
    mutual:  `互卦【${mutual.hexName}】体用关系为${mutual.info.rel}，判定${mutual.info.jxLabel}。${m ? '运势中段能量顺畅，执行力与周旋能力较强，有利逢凶化吉。' : '运势中段存在内耗，建议减少不必要的分散，聚焦核心目标。'}`,
    changed: `之卦【${changed.hexName}】体用关系为${changed.info.rel}，判定${changed.info.jxLabel}。${c ? '最终结果走势积极，坚持努力将有理想收获，整体前景乐观。' : '结果层面仍需努力，宜提早布局、广结善缘，以时间换取空间。'}`,
    elem:    `喜神占${favorCount}位，忌神占${avoidCount}位。${elemOk ? '五行整体配合度高，各方面运势均有正向加持。' : '忌神偏重，建议在关键决策前多做准备，以实力与耐心弥补五行阻力。'}`,
  }

  return { career, romance, health, wealth, overall }
}
