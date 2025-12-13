import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const form = await req.formData()
  const name = String(form.get("name") || "")
  const phone = String(form.get("phone") || "")
  const email = String(form.get("email") || "")
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 })
  const { error } = await supabase.from("buyers").insert({ name, phone, email })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.redirect(new URL("/dashboard/buyers", req.url))
}
