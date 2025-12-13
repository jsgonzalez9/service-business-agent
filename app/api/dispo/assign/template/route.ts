import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"
import { sendSMS } from "@/lib/twilio"

function buildPdf(lines: Array<{ text: string; x?: number; y?: number }>) {
  const header = "%PDF-1.4\n"
  const objects: string[] = []
  objects.push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n")
  objects.push("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n")
  const page =
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n"
  objects.push(page)
  const contentLines = lines
    .map((l, i) => {
      const x = typeof l.x === "number" ? l.x : 72
      const y = typeof l.y === "number" ? l.y : 720 - i * 18
      const safe = l.text.replace(/[\(\)]/g, "")
      return `BT /F1 12 Tf ${x} ${y} Td (${safe}) Tj ET`
    })
    .join("\n")
  const stream = `4 0 obj\n<< /Length ${contentLines.length + 1} >>\nstream\n${contentLines}\nendstream\nendobj\n`
  objects.push(stream)
  objects.push("5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n")
  let body = ""
  const xrefPositions: number[] = []
  let offset = header.length
  for (const obj of objects) {
    xrefPositions.push(offset)
    body += obj
    offset += obj.length
  }
  const xrefStart = header.length + body.length
  const xref =
    `xref\n0 ${objects.length + 1}\n` +
    `0000000000 65535 f \n` +
    xrefPositions.map((pos) => String(pos).padStart(10, "0") + " 00000 n \n").join("")
  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`
  const pdf = header + body + xref + trailer
  return Buffer.from(pdf, "utf-8")
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const svc = createServiceClient()
  const { leadId, buyerId, assignmentFee } = await req.json()
  if (!leadId || !buyerId) return NextResponse.json({ error: "leadId and buyerId required" }, { status: 400 })
  const { data: lead } = await supabase.from("leads").select("*").eq("id", leadId).single()
  const { data: buyer } = await supabase.from("buyers").select("*").eq("id", buyerId).single()
  if (!lead || !buyer) return NextResponse.json({ error: "lead or buyer not found" }, { status: 404 })
  const fee = typeof assignmentFee === "number" ? assignmentFee : (lead.best_assignment_fee ? Number(lead.best_assignment_fee) : null)
  const lines = [
    { text: "Assignment of Contract (Templated)", x: 72, y: 740 },
    { text: `Property: ${lead.address}` },
    { text: `Seller: ${lead.name} (${lead.phone_number})` },
    { text: `Buyer: ${buyer.name} (${buyer.phone || buyer.email || "-"})` },
    { text: `Offer price: ${lead.offer_amount ? `$${Number(lead.offer_amount).toLocaleString()}` : "-"}` },
    { text: `Assignment fee: ${fee ? `$${Number(fee).toLocaleString()}` : "-"}` },
    { text: `Date: ${new Date().toLocaleDateString()}` },
    { text: "By proceeding, both parties agree to the assignment terms per the attached standard." },
  ]
  const pdfBuf = buildPdf(lines)
  const path = `assignments/${lead.id}-${Date.now()}-templated.pdf`
  const bytes = new Uint8Array(pdfBuf)
  const blob = new Blob([bytes], { type: "application/pdf" })
  const { error: upErr } = await svc.storage.from("contracts").upload(path, blob, { cacheControl: "3600", upsert: false } as any)
  if (upErr) return NextResponse.json({ error: upErr.message || "Upload failed" }, { status: 500 })
  const { data: signed } = await svc.storage.from("contracts").createSignedUrl(path, 60 * 60 * 24 * 7)
  await supabase.from("leads").update({ winning_buyer_id: buyerId, assignment_pdf_path: path, best_assignment_fee: fee ?? lead.best_assignment_fee }).eq("id", leadId)
  try {
    if (lead.phone_number) await sendSMS(lead.phone_number, `Assignment prepared. Link: ${signed?.signedUrl || "[dashboard]"}`, { withFooter: false, bypassSuppression: true })
    // Do not send assignment link to buyer. Buyer will receive AC purchase agreement separately.
  } catch {}
  return NextResponse.json({ success: true, path, signedUrl: signed?.signedUrl || null })
}
