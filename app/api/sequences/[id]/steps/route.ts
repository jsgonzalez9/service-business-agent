import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const payload = await request.json()
    const { id } = await context.params
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("sequence_steps")
      .insert({
        sequence_id: id,
        step_index: payload.step_index,
        type: payload.type,
        delay_minutes: payload.delay_minutes,
        message: payload.message || null,
        recording_url: payload.recording_url || null,
        active: payload.active ?? true,
      })
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, step: data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to add step" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("sequence_steps")
      .select("*")
      .eq("sequence_id", id)
      .order("step_index", { ascending: true })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, steps: data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to list steps" }, { status: 500 })
  }
}
