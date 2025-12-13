import type { Lead } from "@/lib/types"

export function mao(arv: number, repairs: number, fee: number, multiplier: number): number {
  const v = arv * multiplier - repairs - fee
  return Math.max(0, Math.round(v))
}

export function enforceRails(lead: Lead, maoValue: number, proposed?: number): { allowed: boolean; nextAmount?: number } {
  const softCeil = Math.round(maoValue * 1.02)
  const hardFloor = Math.round(maoValue * 0.9)
  const p = proposed ?? lead.offer_amount ?? 0
  if (!p) return { allowed: true, nextAmount: hardFloor }
  if (p > softCeil) return { allowed: false, nextAmount: softCeil }
  if (p < hardFloor) return { allowed: false, nextAmount: hardFloor }
  return { allowed: true, nextAmount: p }
}

