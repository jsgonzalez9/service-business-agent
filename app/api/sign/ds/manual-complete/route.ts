import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { leadId, role, signedUrl } = await req.json()
  if (!leadId || !role) return NextResponse.json({ error: "leadId and role required" }, { status: 400 })
  if (role !== "seller" && role !== "buyer") return NextResponse.json({ error: "role must be seller or buyer" }, { status: 400 })
  const update: Record<string, any> = {}
  if (role === "seller") {
    update.seller_contract_status = "completed"
    if (signedUrl) update.seller_contract_signed_url = signedUrl
    update.contract_link = null
  } else {
    update.buyer_contract_status = "completed"
    if (signedUrl) update.buyer_contract_signed_url = signedUrl
  }
  const { error } = await supabase.from("leads").update(update).eq("id", leadId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
