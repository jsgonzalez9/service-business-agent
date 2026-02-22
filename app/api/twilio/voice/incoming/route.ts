import { type NextRequest, NextResponse } from "next/server"
import { sendSMS } from "@/lib/twilio"
import { getLeadByPhone, createLead, saveMessage } from "@/lib/lead-actions"

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const from = formData.get("From") as string
  
  const callback = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/twilio/voice/recording`
  
  if (from) {
      // 1. Find or Create Lead
      let lead = await getLeadByPhone(from)
      if (!lead) {
          const { lead: newLead } = await createLead({
              name: "Missed Call",
              phone_number: from,
              address: "Unknown"
          })
          lead = newLead
      }
      
      if (lead) {
          // 2. Send SMS
          const smsText = "Sorry we missed your call. What service do you need help with?"
          const { sid } = await sendSMS(from, smsText)
          
          // 3. Save Message
          await saveMessage({
              lead_id: lead.id,
              direction: "outbound",
              content: smsText,
              twilio_sid: sid || undefined
          })
      }
  }

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Thanks for calling. We are currently helping other customers. Please leave a message or reply to the text we just sent you.</Say>
  <Record maxLength="600" playBeep="true" transcribe="false" recordingStatusCallback="${callback}" />
</Response>`
  return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } })
}
