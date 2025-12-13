import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"
import { sendSMS } from "@/lib/twilio"

export async function POST(req: NextRequest) {
  const { leadId, target } = await req.json()
  if (!leadId || !target) return NextResponse.json({ error: "leadId and target required" }, { status: 400 })
  const supabase = await createClient()
  const { data: lead } = await supabase.from("leads").select("*").eq("id", leadId).single()
  if (!lead || !lead.assignment_pdf_path) return NextResponse.json({ error: "no assignment" }, { status: 404 })
  const svc = createServiceClient()
  const { data: signed } = await svc.storage.from("contracts").createSignedUrl(String(lead.assignment_pdf_path), 60 * 60 * 24 * 7)
  const url = signed?.signedUrl || null
  let phone: string | null = null
  if (target === "seller") phone = lead.phone_number
  if (target === "buyer" && lead.winning_buyer_id) {
    const { data: buyer } = await supabase.from("buyers").select("phone").eq("id", lead.winning_buyer_id).single()
    phone = (buyer as any)?.phone || null
  }
  if (!phone) return NextResponse.json({ error: "no recipient phone" }, { status: 400 })
  if (url) await sendSMS(phone, `Assignment summary link: ${url}`, { withFooter: false, bypassSuppression: true })
  return NextResponse.json({ success: true })
}
