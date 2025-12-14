import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"

export async function POST(request: Request) {
  try {
    const supabase = createServiceClient()
    const form = await request.formData()
    const id = String(form.get("id") || "")
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
    const { data: tmpl } = await supabase.from("contract_templates").select("*").eq("id", id).single()
    if (!tmpl) return NextResponse.json({ error: "template not found" }, { status: 404 })
    if (tmpl.storage_path && !tmpl.storage_path.startsWith("docuseal:")) {
      await supabase.storage.from("contracts").remove([tmpl.storage_path])
    }
    const { error: delErr } = await supabase.from("contract_templates").delete().eq("id", id)
    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Delete failed" }, { status: 500 })
  }
}
