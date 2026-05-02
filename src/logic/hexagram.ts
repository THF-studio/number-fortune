import { TG, HEXDESC } from './constants'
import { getRelAndJX } from './elements'
import type { HexagramLayer } from '../types'

export function linesToKey(lines: [number, number, number]): number {
  return 8 - (lines[0] * 4 + lines[1] * 2 + lines[2])
}

export function getMutual(upper: number, lower: number): [number, number] {
  const h = [...TG[lower].lines, ...TG[upper].lines]
  return [
    linesToKey([h[2], h[3], h[4]] as [number, number, number]),
    linesToKey([h[1], h[2], h[3]] as [number, number, number]),
  ]
}

export function getChanged(upper: number, lower: number, movLine: number): [number, number] {
  const h = [...TG[lower].lines, ...TG[upper].lines]
  const c = [...h]
  c[movLine - 1] ^= 1
  return [
    linesToKey([c[3], c[4], c[5]] as [number, number, number]),
    linesToKey([c[0], c[1], c[2]] as [number, number, number]),
  ]
}

export function hexName(upper: number, lower: number): string {
  return (HEXDESC[`${upper}-${lower}`] ?? { name: '未知' }).name
}

export function buildLayer(upper: number, lower: number, movingLine: number): HexagramLayer {
  const bodyIsUpper = movingLine <= 3
  const bodyEl = bodyIsUpper ? TG[upper].element : TG[lower].element
  const useEl  = bodyIsUpper ? TG[lower].element : TG[upper].element
  return {
    upperKey: upper,
    lowerKey: lower,
    hexName: hexName(upper, lower),
    info: getRelAndJX(bodyEl, useEl),
  }
}
