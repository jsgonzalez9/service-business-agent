import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

function extractZip(address: string): string | null {
  const m = address.match(/\b(\d{5})\b/)
  return m ? m[1] : null
}

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const leadId = req.nextUrl.searchParams.get("leadId") || ""
  if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 })
  const { data: lead } = await supabase.from("leads").select("*").eq("id", leadId).single()
  if (!lead) return NextResponse.json({ error: "not found" }, { status: 404 })
  const zip = extractZip(lead.address || "")
  const price = lead.offer_amount || 0
  let q = supabase.from("buyer_interests").select("*,buyers(name,phone,email)")
  if (zip) q = q.eq("zip", zip)
  const { data } = await q
  const matches = (data || []).filter((b: any) => !price || (b.price_min == null || price >= Number(b.price_min)) && (b.price_max == null || price <= Number(b.price_max)))
  return NextResponse.json({ matches })
}
