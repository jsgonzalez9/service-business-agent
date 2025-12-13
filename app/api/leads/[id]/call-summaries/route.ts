import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("call_summaries")
      .select("*")
      .eq("lead_id", id)
      .order("created_at", { ascending: false })
      .limit(5)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, summaries: data || [] })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to fetch call summaries" }, { status: 500 })
  }
}
