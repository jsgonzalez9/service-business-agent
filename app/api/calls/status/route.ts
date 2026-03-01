/**
 * Task #4: Call Status Endpoint for n8n Polling
 * Vapi-compatible status API
 */

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const callId = url.searchParams.get("id")

  if (!callId) {
    return NextResponse.json({ error: "Call ID required" }, { status: 400 })
  }

  try {
    const supabase = await createClient()

    // Get call with all qualification data
    const { data: call, error } = await supabase
      .from("calls")
      .select(`
        id,
        call_status,
        lead_id,
        twilio_call_sid,
        duration_seconds,
        transcript,
        summary,
        sentiment,
        ended_reason,
        interest_level,
        motivation,
        urgency,
        past_experience,
        budget,
        paid_intent,
        offer_discussed,
        offer_amount,
        next_steps,
        created_at,
        updated_at,
        leads!inner(phone_number)
      `)
      .eq("id", callId)
      .single()

    if (error || !call) {
      return NextResponse.json({ error: "Call not found" }, { status: 404 })
    }

    // Get phone from joined leads (array) or null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const phoneNumber = call.leads?.[0]?.phone_number ?? null

    // Map to Vapi-compatible response
    return NextResponse.json({
      id: call.id,
      status: call.call_status,
      endedReason: call.ended_reason,
      duration: call.duration_seconds || 0,
      customer: {
        number: phoneNumber
      },
      transcript: call.transcript,
      artifacts: {
        // Vapi-style structured outputs
        structuredOutputs: {
          interest_level: call.interest_level,
          motivation: call.motivation,
          urgency: call.urgency,
          past_experience: call.past_experience,
          budget: call.budget,
          paid_intent: call.paid_intent,
          offer_discussed: call.offer_discussed,
          offer_amount: call.offer_amount,
          next_steps: call.next_steps,
          sentiment: call.sentiment,
          status: call.call_status === "completed" ? "complete" : "in-progress"
        }
      },
      createdAt: call.created_at,
      updatedAt: call.updated_at
    })

  } catch (error) {
    console.error("[Call Status] Error:", error)
    return NextResponse.json({ error: "Failed to fetch call" }, { status: 500 })
  }
}