import { describe, it, expect } from "vitest"
import { canTransition } from "@/lib/state-machine"
import { scoreLead } from "@/lib/scoring"
import { enforceRails, mao } from "@/lib/negotiation-rails"

describe("state-machine", () => {
  it("allows valid transitions", () => {
    expect(canTransition("NEW","CONTACTED")).toBe(true)
    expect(canTransition("CONTACTED","QUALIFIED")).toBe(true)
    expect(canTransition("NEW","CLOSED")).toBe(false)
  })
})

describe("scoring", () => {
  it("scores lead", () => {
    const lead: any = { motivation: "urgent sale", timeline: "asap", property_condition: "needs repairs", price_expectation: 200000, offer_amount: 190000 }
    const s = scoreLead(lead, [])
    expect(s).toBeGreaterThan(50)
  })
})

describe("rails", () => {
  it("enforces bounds", () => {
    const m = mao(200000, 30000, 10000, 0.7)
    const r = enforceRails({} as any, m, 500000)
    expect(r.allowed).toBe(false)
  })
})
