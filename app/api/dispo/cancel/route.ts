import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendSMS } from "@/lib/twilio"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { leadId } = await req.json()
  if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 })
  const { data: lead } = await supabase.from("leads").select("*").eq("id", leadId).single()
  if (!lead) return NextResponse.json({ error: "not found" }, { status: 404 })
  const msg = `Thanks again for your time. We weren’t able to secure a buyer at the current terms. To keep things simple, we’ll cancel during the inspection period. If you’d like to revisit pricing, just let me know.`
  await sendSMS(lead.phone_number, msg)
  const { error } = await supabase.from("leads").update({ conversation_state: "lost", deal_state: "DEAD", dispo_status: "cancelled" }).eq("id", leadId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
