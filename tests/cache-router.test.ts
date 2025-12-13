import { describe, it, expect } from "vitest"
import { normalizeQuestion, classifyIntent } from "@/lib/cache-router"

describe("cache-router", () => {
  it("normalizes question", () => {
    expect(normalizeQuestion("How does this process WORK?!  ")).toBe("how does this process work")
  })
  it("classifies FAQ intents", () => {
    expect(classifyIntent("How does the process work?")).toBe("FAQ_PROCESS")
    expect(classifyIntent("Do you charge commissions or fees?")).toBe("FAQ_FEES")
    expect(classifyIntent("Is this legit or a scam?")).toBe("FAQ_TRUST")
    expect(classifyIntent("Can I cancel during inspection period?")).toBe("FAQ_CONTRACT")
  })
})
