import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { canTransition } from "@/lib/state-machine"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { leadId, to } = await req.json()
  if (!leadId || !to) return NextResponse.json({ error: "leadId and to required" }, { status: 400 })
  const { data: lead } = await supabase.from("leads").select("id,deal_state,state_history").eq("id", leadId).single()
  if (!lead) return NextResponse.json({ error: "lead not found" }, { status: 404 })
  if (!canTransition(lead.deal_state as any, to)) return NextResponse.json({ error: "invalid transition" }, { status: 400 })
  const hist = Array.isArray(lead.state_history) ? lead.state_history : []
  hist.push({ from: lead.deal_state, to, at: new Date().toISOString() })
  const { error } = await supabase
    .from("leads")
    .update({ deal_state: to, state_entered_at: new Date().toISOString(), state_history: hist })
    .eq("id", leadId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
