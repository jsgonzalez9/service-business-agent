import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendSMS } from "@/lib/twilio"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { leadId, assignmentFee, buyerId } = await req.json()
  if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 })
  const { data: lead } = await supabase.from("leads").select("*").eq("id", leadId).single()
  if (!lead) return NextResponse.json({ error: "not found" }, { status: 404 })
  const updates: any = { deal_state: "CLOSED", conversation_state: "closed", dispo_status: "sold" }
  if (typeof assignmentFee === "number" && assignmentFee > 0) updates.best_assignment_fee = assignmentFee
  const { error } = await supabase.from("leads").update(updates).eq("id", leadId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  try {
    await sendSMS(lead.phone_number, "Great news — we have an assignment in place. We’ll coordinate next steps with title. Thank you!", {
      withFooter: false,
      bypassSuppression: true,
    })
  } catch {}
  return NextResponse.json({ success: true })
}
