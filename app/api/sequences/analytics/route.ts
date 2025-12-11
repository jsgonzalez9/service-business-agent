import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { data: steps } = await supabase
      .from("lead_sequence_steps")
      .select("*")
      .gte("sent_at", since)
    const bySeq: Record<string, any> = {}
    for (const st of steps || []) {
      const seqId = (st as any).sequence_id || (st as any).lead_sequence_id
      const seqKey = seqId as string
      bySeq[seqKey] = bySeq[seqKey] || { sent: 0, errors: 0, queued: 0, responses: 0, firstResponseMinutes: [] as number[], templates: {} as Record<string, number> }
      const s = bySeq[seqKey]
      if ((st as any).status === "sent") s.sent++
      if ((st as any).status === "error") s.errors++
      if ((st as any).status === "queued") s.queued++
      const msg = (st as any).metadata?.message
      if (msg) s.templates[msg] = (s.templates[msg] || 0) + 1
    }
    return NextResponse.json({ success: true, analytics: bySeq })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to compute analytics" }, { status: 500 })
  }
}
