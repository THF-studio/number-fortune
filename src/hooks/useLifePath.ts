import { calculateLifePath } from '../logic/lifepath'
import type { LifePathDOBInput, LifePathResult } from '../types'

export function useLifePath(input: LifePathDOBInput | null): LifePathResult | null {
  if (!input || !input.year || !input.month || !input.day) return null
  return calculateLifePath(input.year, input.month, input.day)
}
