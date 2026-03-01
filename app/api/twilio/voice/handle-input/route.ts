/**
 * Task #1 & #2: Handle Voice Input with Qualification Sequence
 * AI Disclosure + Structured Output Tracking
 * Vapi "Elliot" Standard
 */

import { type NextRequest, NextResponse } from "next/server"
import twilio from "twilio"
import { getLeadById, updateLead } from "@/lib/lead-actions"
import { updateCall, addCallEvent, getCallById } from "@/lib/voice-call-actions"
import { getRuntimeSettings } from "@/lib/settings"
import { validateTwilioRequest } from "@/lib/twilio"
import { generateVoiceResponse, processCallCompletion } from "@/lib/voice-agent-updated"
import { detectEndedReason } from "@/lib/voice-qualification"

const VoiceResponse = twilio.twiml.VoiceResponse

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const signature = request.headers.get("x-twilio-signature") || ""
    const params: Record<string, string> = {}
    for (const [key, value] of formData.entries()) {
      params[key] = String(value)
    }

    const valid = validateTwilioRequest(signature, request.url, params)
    if (!valid) {
      const twiml = new VoiceResponse()
      twiml.hangup()
      return new NextResponse(twiml.toString(), {
        status: 403,
        headers: { "Content-Type": "text/xml" },
      })
    }

    const callId = request.nextUrl.searchParams.get("call_id") as string
    const leadId = request.nextUrl.searchParams.get("lead_id") as string
    const speechResult = formData.get("SpeechResult") as string
    const callDuration = parseInt(formData.get("CallDuration") as string || "0")
    const callStatus = formData.get("CallStatus") as string

    console.log(`[Voice Input] CallId: ${callId}, Speech: "${speechResult}", Status: ${callStatus}`)

    const lead = await getLeadById(leadId)
    const callRecord = await getCallById(callId)

    if (!lead || !callId) {
      const twiml = new VoiceResponse()
      twiml.say("Sorry, I couldn't process that. Goodbye.")
      twiml.hangup()
      return new NextResponse(twiml.toString(), {
        headers: { "Content-Type": "text/xml" },
      })
    }

    // Track transcript
    const transcriptEntry = `User: ${speechResult}\n`
    const currentTranscript = callRecord?.transcript ? callRecord.transcript + transcriptEntry : transcriptEntry

    // Enforce max call duration
    const settings = await getRuntimeSettings()
    const maxMinutes = Number(settings.maxCallMinutes || 5)
    let elapsedSec = 0
    
    if (callRecord && maxMinutes > 0) {
      const started = new Date(callRecord.created_at)
      const now = new Date()
      elapsedSec = Math.floor((now.getTime() - started.getTime()) / 1000)
      
      if (elapsedSec >= maxMinutes * 60 || callDuration >= maxMinutes * 60) {
        // Max duration reached - process completion
        await processCallCompletion(callId, currentTranscript, "max_duration", elapsedSec)
        
        const twiml = new VoiceResponse()
        twiml.say("Thanks for your time today. We'll follow up with next steps. Goodbye.")
        twiml.hangup()
        return new NextResponse(twiml.toString(), { 
          headers: { "Content-Type": "text/xml" } 
        })
      }
    }

    // Handle call end events from Twilio
    if (callStatus === "completed" || callStatus === "busy" || callStatus === "failed" || callStatus === "no-answer") {
      const endedReason = detectEndedReason(callStatus, currentTranscript)
      await processCallCompletion(callId, currentTranscript, endedReason, callDuration || elapsedSec)
      
      const twiml = new VoiceResponse()
      twiml.hangup()
      return new NextResponse(twiml.toString(), { 
        headers: { "Content-Type": "text/xml" } 
      })
    }

    // Generate AI response using new voice agent with AI disclosure
    const config = {
      leadId,
      phone: lead.phone_number,
      companyName: process.env.COMPANY_NAME || "AI Labs",
      agentName: "Lux",
      mode: "outbound" as const,
    }

    const response = await generateVoiceResponse(lead, currentTranscript, config)

    // Update call transcript
    const updatedTranscript = currentTranscript + `Agent: ${response.message}\n`
    await updateCall(callId, {
      transcript: updatedTranscript,
      call_status: response.shouldEndCall ? "completed" : "in_progress",
    })

    // Log event
    await addCallEvent(callId, "transcript_update", {
      speech: speechResult,
      response: response.message,
      action: response.action,
    })

    // Build TwiML response
    const twiml = new VoiceResponse()

    if (response.shouldEndCall) {
      // Call ending
      // @ts-expect-error Twilio types mismatch
      twiml.say(response.message, { voice: "Polly.Joanna" })
      
      // Process completion
      const finalDuration = callDuration || elapsedSec || 0
      const endedReason = response.action === "end" 
        ? detectEndedReason("completed", updatedTranscript)
        : "completed"
      
      await processCallCompletion(callId, updatedTranscript, endedReason, finalDuration)
      
      twiml.hangup()
    } else {
      // Continue conversation
      const gather = twiml.gather({
        timeout: 5, // Longer timeout for natural conversation
        action: `/api/twilio/voice/handle-input?call_id=${callId}&lead_id=${leadId}`,
        method: "POST",
        speechTimeout: "auto",
        language: "en-US",
        input: ["speech"],
      })

      // @ts-expect-error Twilio types mismatch
      gather.say(response.message, { voice: "Polly.Joanna" })

      // Fallback if no speech detected
      // @ts-expect-error Twilio types mismatch
      twiml.say("I didn't catch that. Could you repeat?", { voice: "Polly.Joanna" })
      twiml.redirect(`/api/twilio/voice/handle-input?call_id=${callId}&lead_id=${leadId}`)
    }

    return new NextResponse(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    })

  } catch (error) {
    console.error("[Voice Handle Input] Error:", error)

    const twiml = new VoiceResponse()
    // @ts-expect-error Twilio types mismatch
    twiml.say("I'm having technical difficulties. Let me try again.", { voice: "Polly.Joanna" })
    
    // Try to get context for error recovery
    const callId = request.nextUrl.searchParams.get("call_id")
    const leadId = request.nextUrl.searchParams.get("lead_id")
    
    if (callId && leadId) {
      twiml.gather({
        timeout: 3,
        action: `/api/twilio/voice/handle-input?call_id=${callId}&lead_id=${leadId}`,
      })
    } else {
      twiml.hangup()
    }

    return new NextResponse(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    })
  }
}