/**
 * Task #1: Updated Outbound Voice Callback
 * AI Disclosure Prompt + Qualification Sequence
 * Vapi "Elliot" Standard Implementation
 */

import { type NextRequest, NextResponse } from "next/server"
import twilio from "twilio"
import { updateCall } from "@/lib/voice-call-actions"

const VoiceResponse = twilio.twiml.VoiceResponse

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const callId = searchParams.get("call_id")
    const leadId = searchParams.get("lead_id")
    const leadName = searchParams.get("lead_name") || "there"
    const companyName = searchParams.get("company_name") || "AI Labs"
    const requestText = searchParams.get("request") || "AI automation"

    if (!callId || !leadId) {
      const twiml = new VoiceResponse()
      // @ts-expect-error Twilio types mismatch
      twiml.say("Sorry, there was an error connecting your call.", { voice: "Polly.Joanna" })
      twiml.hangup()
      return new NextResponse(twiml.toString(), {
        headers: { "Content-Type": "text/xml" },
      })
    }

    // Mark call as connected
    await updateCall(callId, {
      call_status: "in_progress",
    })

    const twiml = new VoiceResponse()

    // === TASK #1: AI Disclosure in First 10 Seconds ===
    const gather = twiml.gather({
      timeout: 5, // Give them time to respond
      action: `/api/twilio/voice/handle-input?call_id=${callId}&lead_id=${leadId}`,
      method: "POST",
      speechTimeout: "auto",
      language: "en-US",
      input: ["speech"],
    })

    // AI Disclosure + Ask for confirmation (First 10 seconds)
    // This follows Vapi "Elliot" standard - AI must identify itself
    const aiIntroMessage = `Hi, this is Lux, an AI assistant calling from ${companyName}. I'm reaching out because you recently submitted a request for help with ${requestText}. Is this ${leadName}?`

    // @ts-expect-error Twilio types mismatch
    gather.say(aiIntroMessage, { voice: "Polly.Joanna" })

    return new NextResponse(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    })
  } catch (error) {
    console.error("[Outbound Callback] Error:", error)
    const twiml = new VoiceResponse()
    // @ts-expect-error Twilio types mismatch
    twiml.say("Sorry, there was an error connecting your call.", { voice: "Polly.Joanna" })
    twiml.hangup()
    return new NextResponse(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    })
  }
}

// Twilio sometimes sends GET for initial webhook
export async function GET(request: NextRequest) {
  return POST(request)
}