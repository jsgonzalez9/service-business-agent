import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("a2p_campaigns")
      .insert({
        brand_id: payload.brand_id,
        campaign_name: payload.campaign_name,
        description: payload.description || null,
        message_flow: payload.message_flow || null,
        call_to_action: payload.call_to_action || null,
        sample_messages: payload.sample_messages || null,
        submission_status: "submitted",
      })
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase.from("a2p_logs").insert({
      entity_type: "campaign",
      entity_id: data.id,
      level: "info",
      message: "Campaign submitted",
      meta: payload,
    })

    return NextResponse.json({ success: true, campaign: data })
  } catch {
    return NextResponse.json({ error: "Failed to submit campaign" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("a2p_campaigns").select("*").order("created_at", { ascending: false }).limit(50)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, campaigns: data })
  } catch {
    return NextResponse.json({ error: "Failed to list campaigns" }, { status: 500 })
  }
}
