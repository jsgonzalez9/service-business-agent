import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()
  const { data: metrics } = await supabase
    .from("message_metrics")
    .select("confidence,created_at")
    .gte("created_at", since)
  const { data: hits } = await supabase.from("cached_hits").select("created_at").gte("created_at", since)
  const { data: leadsContracts } = await supabase
    .from("leads")
    .select("id,conversation_state")
    .or("conversation_state.eq.contract_sent,conversation_state.eq.contract_signed,conversation_state.eq.closed")
    .gte("updated_at", since)
  const messagesCount = (metrics || []).length
  const avgConfidence =
    messagesCount > 0
      ? (metrics || []).reduce((a: number, m: any) => a + (typeof m.confidence === "number" ? m.confidence : 0), 0) / messagesCount
      : 0
  const faqHits = (hits || []).length
  const contractsSent = (leadsContracts || []).filter((l: any) => l.conversation_state === "contract_sent").length
  const contractsSigned = (leadsContracts || []).filter((l: any) => l.conversation_state === "contract_signed").length
  const closed = (leadsContracts || []).filter((l: any) => l.conversation_state === "closed").length
  return NextResponse.json({
    messagesCount,
    avgConfidence,
    faqHits,
    contractsSent,
    contractsSigned,
    closed,
  })
}
