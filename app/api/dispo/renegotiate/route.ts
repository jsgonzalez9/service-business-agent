import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { enforceRails, mao } from "@/lib/negotiation-rails"
import { sendSMS } from "@/lib/twilio"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { leadId, proposed } = await req.json()
  if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 })
  const { data: lead } = await supabase.from("leads").select("*").eq("id", leadId).single()
  if (!lead) return NextResponse.json({ error: "not found" }, { status: 404 })
  const baseMao = mao(lead.arv || 0, lead.repair_estimate || 0, 10000, 0.7)
  const r = enforceRails(lead, baseMao, proposed || undefined)
  const nextAmount = r.nextAmount || baseMao
  const { error } = await supabase.from("leads").update({ offer_amount: nextAmount, dispo_status: "renegotiated" }).eq("id", leadId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const msg = `Quick update: to get this done, we can adjust the offer to $${nextAmount.toLocaleString()}. Does that work for you? If not, we can cancel during the inspection period.`
  await sendSMS(lead.phone_number, msg)
  return NextResponse.json({ success: true, newOffer: nextAmount })
}
