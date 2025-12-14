import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const ct = req.headers.get("content-type") || ""
  let rawTemplateId = ""
  let url = ""
  let role = ""
  let state = ""
  if (ct.includes("application/json")) {
    const body = await req.json()
    rawTemplateId = String(body.templateId || "")
    url = String(body.url || "")
    role = String(body.role || "")
    state = String(body.state || "")
  } else {
    const form = await req.formData()
    rawTemplateId = String(form.get("templateId") || "")
    url = String(form.get("url") || "")
    role = String(form.get("role") || "")
    state = String(form.get("state") || "")
  }
  if ((!rawTemplateId && !url) || !role) return NextResponse.json({ error: "templateId or url and role required" }, { status: 400 })
  const templateId = rawTemplateId.startsWith("http") ? "" : rawTemplateId
  const directLink = url || (rawTemplateId.startsWith("http") ? rawTemplateId : "")
  const { data: row } = await supabase
    .from("contract_templates")
    .select("*")
    .eq("role", role)
    .eq("state", state || null)
    .maybeSingle()
  if (!row) {
    const name = `DocuSeal ${role}${state ? ` (${state})` : ""}`
    const storage_path =
      url || rawTemplateId.startsWith("http")
        ? `docuseal:${url || rawTemplateId}`
        : `docuseal:template:${rawTemplateId}`
    const { data: created, error: insErr } = await supabase
      .from("contract_templates")
      .insert({ name, storage_path, role, state: state || null, docuseal_template_id: templateId || null, docuseal_direct_link: directLink || null })
      .select("*")
      .single()
    if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 })
    return NextResponse.json({ success: true, template: created })
  }
  const { error } = await supabase
    .from("contract_templates")
    .update({ docuseal_template_id: templateId || null, docuseal_direct_link: directLink || null })
    .eq("id", row.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
