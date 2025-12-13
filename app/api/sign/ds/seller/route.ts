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
  const { leadId } = await req.json()
  if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 })
  const { data: lead } = await supabase.from("leads").select("*").eq("id", leadId).single()
  if (!lead) return NextResponse.json({ error: "lead not found" }, { status: 404 })
  const { data: tmpl } = await supabase
    .from("contract_templates")
    .select("*")
    .eq("role", "seller")
    .maybeSingle()
  if (!tmpl?.docuseal_template_id && !tmpl?.docuseal_direct_link) return NextResponse.json({ error: "seller template missing docuseal configuration" }, { status: 400 })
  if (tmpl?.docuseal_direct_link) {
    await supabase
      .from("leads")
      .update({
        seller_contract_status: "sent",
        seller_contract_envelope_id: null,
        seller_contract_signed_url: tmpl.docuseal_direct_link,
        contract_link: tmpl.docuseal_direct_link,
        conversation_state: "contract_sent",
      })
      .eq("id", leadId)
    return NextResponse.json({ success: true, signingUrl: tmpl.docuseal_direct_link })
  }
  const packet = await createSigningPacket({
    baseUrl,
    apiToken,
    templateId: tmpl.docuseal_template_id,
    submitters: [{ name: lead.name, email: (lead as any).email, phone: lead.phone_number }],
    fields: { address: lead.address, offer_amount: lead.offer_amount },
  })
  if (packet.error) return NextResponse.json({ error: packet.error }, { status: 500 })
  const signingUrl = (packet.signingUrls || [])[0] || null
  await supabase
    .from("leads")
    .update({
      seller_contract_status: "sent",
      seller_contract_envelope_id: packet.packetId || null,
      seller_contract_signed_url: signingUrl,
      contract_link: signingUrl,
      conversation_state: "contract_sent",
    })
    .eq("id", leadId)
  return NextResponse.json({ success: true, signingUrl })
}
