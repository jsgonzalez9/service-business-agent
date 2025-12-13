import type { Lead, Message } from "@/lib/types"

export function scoreLead(lead: Lead, recentMsgs: Message[]): number {
  let s = 0
  const m = (lead.motivation || "").toLowerCase()
  if (m.includes("urgent") || m.includes("need") || m.includes("must") || m.includes("foreclosure")) s += 20
  const price = lead.price_expectation || 0
  const offer = lead.offer_amount || 0
  if (price && offer && price <= offer * 1.2) s += 20
  const t = (lead.timeline || "").toLowerCase()
  if (t.includes("week") || t.includes("asap") || t.includes("days")) s += 15
  const cond = (lead.property_condition || "").toLowerCase()
  if (cond.includes("needs") || cond.includes("repairs") || cond.includes("distress")) s += 15
  const responsiveness = recentMsgs.slice(-5).length >= 3 ? 15 : 0
  s += responsiveness
  const objections = recentMsgs.filter((r) => r.content.toLowerCase().includes("too low") || r.content.toLowerCase().includes("more")).length
  s -= Math.min(objections * 5, 15)
  return Math.max(0, Math.min(100, s))
}

