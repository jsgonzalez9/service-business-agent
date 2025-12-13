import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"

export async function GET(req: NextRequest) {
  const leadId = req.nextUrl.searchParams.get("leadId") || ""
  if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 })
  const supabase = await createClient()
  const { data: lead } = await supabase.from("leads").select("assignment_pdf_path").eq("id", leadId).single()
  if (!lead || !lead.assignment_pdf_path) return NextResponse.json({ error: "no assignment" }, { status: 404 })
  const svc = createServiceClient()
  const { data, error } = await svc.storage.from("contracts").createSignedUrl(String(lead.assignment_pdf_path), 60 * 60 * 24 * 7)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ url: data?.signedUrl || null })
}
