/**
 * Task #1: Updated Outbound Call API
 * Vapi-compatible request/response format
 * Supports dynamic variables for personalized calls
 */

import { type NextRequest, NextResponse } from "next/server"
import twilio from "twilio"
import { getLeadById, getLeadByPhone, createLead } from "@/lib/lead-actions"
import { createCall, updateCall } from "@/lib/voice-call-actions"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromNumber = process.env.TWILIO_PHONE_NUMBER

export async function POST(request: NextRequest) {
  try {
    // Support both old format AND new Vapi-compatible format
    const body = await request.json()
    
    // Handle Vapi-style request (from n8n - see voice-agent-implementation-guide.md)
    // Vapi format: { customer: { number, name }, assistantOverrides: { variableValues: {...} } }
    const customerNumber = body.customer?.number || body.phone_number || body.phone
    const leadName = body.assistantOverrides?.variableValues?.lead_name || body.name || body.customer?.name
    const companyName = body.assistantOverrides?.variableValues?.lead_company_name || body.company || body.company_name
    const requestText = body.assistantOverrides?.variableValues?.lead_request || body.request || body.message
    const assistantId = body.assistantId || body.assistant_id
    
    // Legacy support: leadId direct
    const leadId = body.leadId || body.lead_id

    if (!customerNumber) {
      return NextResponse.json(
        { error: "Phone number required (customer.number or phone_number)" }, 
        { status: 400 }
      )
    }

    if (!accountSid || !authToken || !fromNumber) {
      return NextResponse.json(
        { error: "Twilio credentials not configured" }, 
        { status: 500 }
      )
    }

    // Normalize phone number to E.164 format
    const normalizedPhone = customerNumber.replace(/\D/g, "")
    const formattedPhone = normalizedPhone.length === 10 
      ? `+1${normalizedPhone}` 
      : `+${normalizedPhone}`

    // Find or create lead
    let lead = await getLeadByPhone(formattedPhone)
    
    if (!lead && leadId) {
      // Try to get by ID if passed
      lead = await getLeadById(leadId)
    }
    
    if (!lead) {
      // Create new lead with available info
      const { lead: newLead, error } = await createLead({
        name: leadName || "Unknown",
        phone_number: formattedPhone,
        address: "Unknown", // Required field
        motivation: requestText || "Unknown request",
        notes: `Form request: ${requestText}`,
        conversation_state: "cold_lead",
        company_name: companyName || null,
      })
      
      if (error || !newLead) {
        return NextResponse.json(
          { error: "Failed to create lead" }, 
          { status: 500 }
        )
      }
      lead = newLead
    }

    // Create call record
    const call = await createCall(lead.id, "outbound")
    if (!call) {
      return NextResponse.json(
        { error: "Failed to create call record" }, 
        { status: 500 }
      )
    }

    // Build callback URL with dynamic variables encoded
    const callbackUrl = new URL(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/twilio/voice/outbound-callback`
    )
    callbackUrl.searchParams.set("call_id", call.id)
    callbackUrl.searchParams.set("lead_id", lead.id)
    callbackUrl.searchParams.set("lead_name", leadName || lead.name || "there")
    callbackUrl.searchParams.set("company_name", companyName || "AI Labs")
    callbackUrl.searchParams.set("request", requestText || lead.motivation || "automation")

    // Initiate Twilio call
    const client = twilio(accountSid, authToken)
    const twilio_call = await client.calls.create({
      from: fromNumber,
      to: formattedPhone,
      url: callbackUrl.toString(),
    })

    // Update call with Twilio SID
    await updateCall(call.id, {
      twilio_call_sid: twilio_call.sid,
      call_status: "ringing",
    })

    // Return Vapi-compatible response
    return NextResponse.json({
      id: call.id,
      status: "ringing",
      customer: { number: formattedPhone },
      startedAt: new Date().toISOString(),
    })

  } catch (error) {
    console.error("[Voice Outbound] Error:", error)
    return NextResponse.json(
      { error: String(error) }, 
      { status: 500 }
    )
  }
}