import { type NextRequest, NextResponse } from "next/server"
import { createLead, getLeadByPhone, saveMessage } from "@/lib/lead-actions"
import { sendSMS } from "@/lib/twilio"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, service_needed, address, message } = body

    if (!phone || !name) {
      return NextResponse.json({ error: "Name and Phone are required" }, { status: 400 })
    }

    // Normalize phone (basic)
    const normalizedPhone = phone.replace(/\D/g, "").length === 10 ? `+1${phone.replace(/\D/g, "")}` : phone

    // 1. Find or Create Lead
    let lead = await getLeadByPhone(normalizedPhone)
    
    if (!lead) {
      const { lead: newLead, error } = await createLead({
        name,
        phone_number: normalizedPhone,
        address: address || "Unknown",
        motivation: service_needed || null, // Mapping Service Type to motivation
        notes: message || "Web Lead",
        conversation_state: "cold_lead"
      })
      
      if (error || !newLead) {
        return NextResponse.json({ error: "Failed to create lead" }, { status: 500 })
      }
      lead = newLead
    }

    // 2. Determine Initial SMS
    const companyName = process.env.COMPANY_NAME || "Service Pro"
    let smsText = `Hi ${name.split(' ')[0]}, thanks for contacting ${companyName}.`
    
    if (service_needed) {
      smsText += ` We received your request for ${service_needed}. Just to confirm, is this for a residential or commercial property?`
    } else {
      smsText += ` How can we help you today?`
    }

    // 3. Send SMS
    const { sid, error: smsError } = await sendSMS(normalizedPhone, smsText)

    if (smsError) {
      console.error("Failed to send initial SMS:", smsError)
    }

    // 4. Save Message
    await saveMessage({
      lead_id: lead.id,
      direction: "outbound",
      content: smsText,
      twilio_sid: sid || undefined
    })

    return NextResponse.json({ success: true, leadId: lead.id })
  } catch (error) {
    console.error("Error processing web lead:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
