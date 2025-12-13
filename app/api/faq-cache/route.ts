import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const intent = req.nextUrl.searchParams.get("intent")
  const qtext = req.nextUrl.searchParams.get("q")
  let q = supabase.from("cached_responses").select("*").order("updated_at", { ascending: false }).limit(50)
  if (intent) q = q.eq("intent", intent)
  if (qtext) q = q.ilike("canonical_question", `%${qtext}%`)
  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ entries: data || [] })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const body = await req.json()
  const { intent, normalized_question, response_text, market, canonical_question } = body || {}
  if (!intent || !normalized_question || !response_text)
    return NextResponse.json({ error: "intent, normalized_question, response_text required" }, { status: 400 })
  const { error } = await supabase
    .from("cached_responses")
    .upsert(
      {
        intent,
        normalized_question,
        response_text,
        market: market || null,
        canonical_question: canonical_question || normalized_question,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "intent,normalized_question" },
    )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const { error } = await supabase.from("cached_responses").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
