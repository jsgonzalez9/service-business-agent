import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const form = await req.formData()
  const file = form.get("csv") as File | null
  if (!file) return NextResponse.json({ error: "csv required" }, { status: 400 })
  const text = await file.text()
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
  let count = 0
  for (const line of lines) {
    const [name, phone, email] = line.split(",").map((s) => s.trim())
    if (!name) continue
    const { error } = await supabase.from("buyers").insert({ name, phone, email })
    if (!error) count++
  }
  return NextResponse.redirect(new URL("/dashboard/buyers", req.url))
}
