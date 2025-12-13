import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"
import { createSigningPacket } from "@/lib/docuseal"

export async function POST(req: NextRequest) {
  const baseUrl = process.env.DOCUSEAL_BASE_URL || ""
  const apiToken = process.env.DOCUSEAL_API_TOKEN || ""
  if (!baseUrl || !apiToken) return NextResponse.json({ error: "DocuSeal not configured" }, { status: 500 })
  const supabase = await createClient()
  const svc = createServiceClient()
  const { leadId, buyerId } = await req.json()
  if (!leadId || !buyerId) return NextResponse.json({ error: "leadId and buyerId required" }, { status: 400 })
  const { data: lead } = await supabase.from("leads").select("*").eq("id", leadId).single()
  const { data: buyer } = await supabase.from("buyers").select("*").eq("id", buyerId).single()
  if (!lead || !buyer) return NextResponse.json({ error: "lead or buyer not found" }, { status: 404 })
  const { data: tmpl } = await supabase.from("contract_templates").select("*").eq("role", "buyer").maybeSingle()
  if (!tmpl?.docuseal_template_id && !tmpl?.docuseal_direct_link) return NextResponse.json({ error: "buyer template missing docuseal configuration" }, { status: 400 })
  const fee = lead.best_assignment_fee ? Number(lead.best_assignment_fee) : 0
  const sellerPrice = lead.offer_amount ? Number(lead.offer_amount) : 0
  const buyerPrice = sellerPrice + fee
  if (tmpl?.docuseal_direct_link) {
    await supabase
      .from("leads")
      .update({
        buyer_contract_status: "sent",
        buyer_contract_envelope_id: null,
        buyer_contract_signed_url: tmpl.docuseal_direct_link,
        buyer_price: buyerPrice,
        winning_buyer_id: buyerId,
      })
      .eq("id", leadId)
    return NextResponse.json({ success: true, signingUrl: tmpl.docuseal_direct_link })
  }
  const packet = await createSigningPacket({
    baseUrl,
    apiToken,
    templateId: tmpl.docuseal_template_id,
    submitters: [{ name: buyer.name, email: buyer.email, phone: buyer.phone }],
    fields: { address: lead.address, buyer_price: buyerPrice },
  })
  if (packet.error) return NextResponse.json({ error: packet.error }, { status: 500 })
  const signingUrl = (packet.signingUrls || [])[0] || null
  await supabase
    .from("leads")
    .update({
      buyer_contract_status: "sent",
      buyer_contract_envelope_id: packet.packetId || null,
      buyer_contract_signed_url: signingUrl,
      buyer_price: buyerPrice,
      winning_buyer_id: buyerId,
    })
    .eq("id", leadId)
  return NextResponse.json({ success: true, signingUrl })
}
