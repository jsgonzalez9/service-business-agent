import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const { data: row, error: getErr } = await supabase.from("cached_responses").select("*").eq("id", id).single()
  if (getErr || !row) return NextResponse.json({ error: getErr?.message || "not found" }, { status: 404 })
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
  const question = row.canonical_question || row.normalized_question
  const emb = await openai.embeddings.create({ model: "text-embedding-3-small", input: question })
  const vec = emb.data[0].embedding
  const { error: upErr } = await supabase.from("cached_responses").update({ embedding: vec }).eq("id", id)
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
