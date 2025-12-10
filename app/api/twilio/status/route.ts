import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Webhook for Twilio status callbacks (delivery reports)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const messageSid = formData.get("MessageSid") as string
    const messageStatus = formData.get("MessageStatus") as string
    const to = formData.get("To") as string

    console.log(`[SMS Status] SID: ${messageSid}, Status: ${messageStatus}, To: ${to}`)

    try {
      const supabase = await createClient()
      await supabase.from("sms_events").insert({
        sid: messageSid,
        to_number: to,
        status: messageStatus,
      })
    } catch {}

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing status callback:", error)
    return NextResponse.json({ error: "Failed to process status" }, { status: 500 })
  }
}
