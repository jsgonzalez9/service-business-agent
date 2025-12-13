import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const form = await req.formData()
  const id = String(form.get("id") || "")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const { error } = await supabase.from("buyers").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.redirect(new URL("/dashboard/buyers", req.url))
}
