import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { mao } from "@/lib/negotiation-rails"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { leadId } = await req.json()
  if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 })
  const { data: lead } = await supabase.from("leads").select("*").eq("id", leadId).single()
  if (!lead) return NextResponse.json({ error: "not found" }, { status: 404 })
  const dispoStart = lead.dispo_started_at ? new Date(lead.dispo_started_at).getTime() : null
  const ageDays = dispoStart ? Math.floor((Date.now() - dispoStart) / (1000 * 60 * 60 * 24)) : 0
  const interested = lead.offers_received || 0
  let recommendation: "renegotiate" | "cancel" | "continue" = "continue"
  let suggestedOffer: number | null = null
  if (interested === 0 && ageDays >= 5) {
    const baseMao = mao(lead.arv || 0, lead.repair_estimate || 0, 10000, 0.7)
    suggestedOffer = Math.round(baseMao * 0.95)
    recommendation = "renegotiate"
  }
  if (interested === 0 && ageDays >= 10) {
    recommendation = "cancel"
  }
  return NextResponse.json({ success: true, recommendation, suggestedOffer })
}
