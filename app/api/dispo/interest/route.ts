import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { leadId, buyerId, phone, amount, notes } = await req.json()
  if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 })
  const { data: lead } = await supabase.from("leads").select("offers_received,best_assignment_fee").eq("id", leadId).single()
  if (!lead) return NextResponse.json({ error: "not found" }, { status: 404 })
  const updates: any = { offers_received: ((lead?.offers_received as number) || 0) + 1 }
  if (typeof amount === "number" && (!lead?.best_assignment_fee || amount > Number(lead.best_assignment_fee))) {
    updates.best_assignment_fee = amount
  }
  await supabase.from("leads").update(updates).eq("id", leadId)
  await supabase
    .from("buyer_offers")
    .insert({ lead_id: leadId, buyer_id: buyerId || null, from_phone: phone || null, amount: amount || null, notes: notes || null })
  return NextResponse.json({ success: true })
}
