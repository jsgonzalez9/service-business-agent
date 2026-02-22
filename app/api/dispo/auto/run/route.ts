import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { mao, enforceRails } from "@/lib/negotiation-rails"
import { sendSMS } from "@/lib/twilio"
import { getAgentConfig } from "@/lib/service-agent"

export const dynamic = "force-dynamic"

export async function POST() {
  const supabase = await createClient()
  const config = await getAgentConfig()
  if (config.auto_dispo_eval_enabled === false) return NextResponse.json({ success: true, skipped: true })
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .or("conversation_state.eq.contract_signed,deal_state.eq.DISPO")
    .eq("dispo_status", "pending")
    .limit(200)
  let evaluated = 0
  let actions = 0
  for (const lead of leads || []) {
    let start = lead.dispo_started_at ? new Date(lead.dispo_started_at).getTime() : undefined
    if (!start && lead.conversation_state === "contract_signed") {
      start = Date.now()
      await supabase.from("leads").update({ dispo_started_at: new Date().toISOString() }).eq("id", lead.id)
    }
    if (!start) continue
    const ageDays = Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24))
    const interested = lead.offers_received || 0
    evaluated++
    if (interested === 0 && ageDays >= (config.auto_cancel_days_threshold ?? 10)) {
      if (config.auto_dispo_require_human_confirm) {
        const note = `\n[AUTO] Recommend cancel during inspection period (no interest in ${ageDays}d).`
        await supabase.from("leads").update({ notes: (lead.notes || "") + note }).eq("id", lead.id)
      } else {
        await sendSMS(lead.phone_number, `We weren’t able to secure a buyer at the current terms. To keep things simple, we’ll cancel during the inspection period. If you’d like to revisit pricing, just let me know.`)
        await supabase.from("leads").update({ conversation_state: "lost", deal_state: "DEAD", dispo_status: "cancelled" }).eq("id", lead.id)
        actions++
      }
      continue
    }
    if (interested === 0 && ageDays >= (config.auto_renegotiate_days_threshold ?? 5)) {
      const baseMao = mao(lead.arv || 0, lead.repair_estimate || 0, config.wholesaling_fee, config.arv_multiplier)
      const target = Math.round(baseMao * 0.95)
      const rails = enforceRails(lead, baseMao, target)
      const nextAmount = rails.nextAmount || target
      if (config.auto_dispo_require_human_confirm) {
        const note = `\n[AUTO] Recommend renegotiate to $${nextAmount.toLocaleString()} (no interest in ${ageDays}d).`
        await supabase.from("leads").update({ notes: (lead.notes || "") + note }).eq("id", lead.id)
      } else {
        await supabase.from("leads").update({ offer_amount: nextAmount, dispo_status: "renegotiated" }).eq("id", lead.id)
        await sendSMS(lead.phone_number, `Quick update: to get this done, we can adjust the offer to $${nextAmount.toLocaleString()}. Does that work for you? If not, we can cancel during the inspection period.`)
        actions++
      }
      continue
    }
  }
  return NextResponse.json({ success: true, evaluated, actions })
}
