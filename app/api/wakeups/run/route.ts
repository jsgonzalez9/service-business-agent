import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendSMS } from "@/lib/twilio"

export async function POST() {
  const supabase = await createClient()
  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString()
  const { data } = await supabase
    .from("leads")
    .select("*")
    .or("last_message_at.is.null,last_message_at.lt." + since)
    .eq("pipeline_status", "FOLLOW-UP")
    .eq("is_opted_out", false)
    .limit(50)
  let sent = 0
  for (const l of data || []) {
    const msg = `Hi ${l.name}, quick check-in about ${l.address}. If selling is still on your radar, we can make a cash offer and move quickly.`
    const { error } = await sendSMS(l.phone_number, msg)
    if (!error) {
      sent++
      await supabase.from("leads").update({ last_message_at: new Date().toISOString() }).eq("id", l.id)
    }
  }
  return NextResponse.json({ success: true, sent })
}
