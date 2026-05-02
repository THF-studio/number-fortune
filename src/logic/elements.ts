import type { Element, RelationResult } from '../types'

const CYCLE: Element[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water']

export function getRelAndJX(bodyEl: Element, useEl: Element): RelationResult {
  const b = CYCLE.indexOf(bodyEl)
  const u = CYCLE.indexOf(useEl)
  if (b === u)           return { rel: '比旺', jx: '吉', jxLabel: '吉',       desc: '用比体，根基稳固',     bodyEl, useEl }
  if ((u + 1) % 5 === b) return { rel: '生入', jx: '吉', jxLabel: '吉',     desc: '用生体，资源主动流入', bodyEl, useEl }
  if ((b + 1) % 5 === u) return { rel: '生出', jx: '凶', jxLabel: '凶',       desc: '体生用，能量外泄耗散', bodyEl, useEl }
  if ((u + 2) % 5 === b) return { rel: '克入', jx: '凶', jxLabel: '凶',       desc: '用克体，受制于人损耗', bodyEl, useEl }
  return                        { rel: '克出', jx: '吉', jxLabel: '吉', desc: '体克用，掌控局面收利', bodyEl, useEl }
}
