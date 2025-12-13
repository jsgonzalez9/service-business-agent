import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendSMS } from "@/lib/twilio"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { leadId } = await req.json()
  if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 })
  const { data: lead } = await supabase.from("leads").select("*").eq("id", leadId).single()
  if (!lead) return NextResponse.json({ error: "not found" }, { status: 404 })
  const { data: interests } = await supabase.from("buyer_interests").select("*,buyers(id,name,phone)").limit(50)
  const msg = `Deal: ${lead.address} • Offer $${lead.offer_amount?.toLocaleString() || "-"} • Reply if interested.`
  for (const i of interests || []) {
    if (i.buyers?.phone) {
      const res = await sendSMS(i.buyers.phone, msg, { withFooter: false, bypassSuppression: true })
      try {
        await supabase.from("buyer_broadcasts").insert({
          lead_id: lead.id,
          buyer_id: i.buyers?.id || null,
          to_phone: i.buyers.phone,
          twilio_sid: res.sid,
        })
      } catch {}
    }
  }
  try {
    if (!lead.dispo_started_at) await supabase.from("leads").update({ dispo_started_at: new Date().toISOString() }).eq("id", lead.id)
  } catch {}
  return NextResponse.json({ success: true, count: (interests || []).length })
}
