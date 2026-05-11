import { DIGIT_ELEM } from '../logic/constants'
import { getMutual, getChanged, buildLayer } from '../logic/hexagram'
import { focusAnalysis, buildAllFocusText } from '../logic/scoring'
import { parseDigits, replaceZeros } from '../utils/helpers'
import type { AnalysisResult, DigitAnalysis } from '../types'

export function useAnalysis(input: Pick<AnalysisInput, 'phone'> | null): AnalysisResult | null {
  if (input === null || input.phone.trim() === '') return null

  const displayDigits = parseDigits(input.phone)
  if (displayDigits.length < 6) return null

  const calcDigits = replaceZeros(displayDigits)
  const N = calcDigits.length
  const group1 = calcDigits.slice(0, Math.floor(N / 2))
  const group2 = calcDigits.slice(Math.floor(N / 2))
  const sum1 = group1.reduce((a, b) => a + b, 0)
  const sum2 = group2.reduce((a, b) => a + b, 0)
  const total = sum1 + sum2

  const uRem = sum1 % 8
  const lRem = sum2 % 8
  const mRem = total % 6
  const upperRem = uRem === 0 ? 8 : uRem
  const lowerRem = lRem === 0 ? 8 : lRem
  const movingLine = mRem === 0 ? 6 : mRem
  const movRem = mRem

  const [mutUpper, mutLower] = getMutual(upperRem, lowerRem)
  const [chgUpper, chgLower] = getChanged(upperRem, lowerRem, movingLine)

  const base    = buildLayer(upperRem, lowerRem, movingLine)
  const mutual  = buildLayer(mutUpper, mutLower, movingLine)
  const changed = buildLayer(chgUpper, chgLower, movingLine)

  const bodyIsUpper = movingLine <= 3
  const hasBlock = [base, mutual, changed].some(h => h.info.rel === '克入' || h.info.rel === '生出')
  const finalOk  = ['生入', '比旺', '克出'].includes(changed.info.rel)
  const overallGood = !hasBlock && finalOk

  const digitAnalysis: DigitAnalysis[] = displayDigits.map(d => ({
    orig: d,
    element: DIGIT_ELEM[d] ?? 'Earth',
    state: 'neutral' as const,
  }))

  const favorCount   = digitAnalysis.filter(x => x.state === 'favor').length
  const avoidCount   = digitAnalysis.filter(x => x.state === 'avoid').length
  const neutralCount = digitAnalysis.filter(x => x.state === 'neutral').length

  const focusScores = focusAnalysis(base, mutual, changed)
  const overallScore = focusScores.overall
  const focusText = buildAllFocusText(base, mutual, changed, favorCount, avoidCount)

  return {
    phone: input.phone,
    displayDigits,
    calcDigits,
    group1,
    group2,
    sum1,
    sum2,
    total,
    upperRem,
    lowerRem,
    movRem,
    movingLine,
    bodyIsUpper,
    base,
    mutual,
    changed,
    hasBlock,
    finalOk,
    overallGood,
    digitAnalysis,
    favorCount,
    avoidCount,
    neutralCount,
    focusScores,
    overallScore,
    focusText,
  }
}
