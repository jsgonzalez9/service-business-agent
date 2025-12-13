import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const leadId = req.nextUrl.searchParams.get("leadId") || ""
  if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 })
  const { data, error } = await supabase
    .from("buyer_offers")
    .select("id,lead_id,buyer_id,from_phone,amount,notes,created_at")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ offers: data || [] })
}
