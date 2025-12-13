import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("cached_hits")
    .select("matched_confidence,created_at,cached_responses(intent)")
    .order("created_at", { ascending: false })
    .limit(100)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ hits: data || [] })
}
