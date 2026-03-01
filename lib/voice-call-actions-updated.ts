/**
 * Updated Voice Call Actions with Qualification Fields
 * Task #3: Database Schema Updates
 * Vapi-style structured output support
 */

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { extractCallQualification } from "./voice-qualification"

const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!, 
  {
    cookies: {
      getAll: async () => (await cookies()).getAll(),
      setAll: async (cookiesToSet) => {
        const cookieStore = await cookies()
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options)
        })
      },
    },
  }
)

// Updated VoiceCall interface with qualification fields
export interface VoiceCall {
  id: string
  lead_id: string
  call_type: "inbound" | "outbound"
  call_status: string
  twilio_call_sid: string | null
  duration_seconds: number | null
  transcript: string | null
  summary: string | null
  offer_discussed: boolean
  offer_amount: number | null
  next_steps: string | null
  sentiment: string | null
  
  // New qualification fields (Task #3)
  interest_level: "high" | "medium" | "low" | "none" | null
  motivation: string | null
  urgency: "this_week" | "this_month" | "this_quarter" | "later" | "unknown" | null
  past_experience: string | null
  budget: "confirmed" | "discussed" | "not_discussed" | "no_budget" | null
  paid_intent: boolean | null
  ended_reason: "completed" | "voicemail" | "wrong_number" | "not_interested" | "callback_requested" | "max_duration" | "failed" | null
  
  created_at: string
  updated_at: string
}

export interface VoiceCallUpdate {
  lead_id?: string
  call_type?: "inbound" | "outbound"
  call_status?: string
  twilio_call_sid?: string | null
  duration_seconds?: number | null
  transcript?: string | null
  summary?: string | null
  offer_discussed?: boolean
  offer_amount?: number | null
  next_steps?: string | null
  sentiment?: string | null
  // Qualification fields
  interest_level?: string | null
  motivation?: string | null
  urgency?: string | null
  past_experience?: string | null
  budget?: string | null
  paid_intent?: boolean | null
  ended_reason?: string | null
}

export async function createCall(
  leadId: string, 
  callType: "inbound" | "outbound"
): Promise<VoiceCall | null> {
  try {
    const { data, error } = await supabase
      .from("calls")
      .insert({
        lead_id: leadId,
        call_type: callType,
        call_status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("[Voice Calls] Create error:", error)
      return null
    }

    return data as VoiceCall
  } catch (error) {
    console.error("[Voice Calls] Unexpected error:", error)
    return null
  }
}

export async function updateCall(
  callId: string, 
  updates: VoiceCallUpdate
): Promise<VoiceCall | null> {
  try {
    const { data, error } = await supabase
      .from("calls")
      .update(updates)
      .eq("id", callId)
      .select()
      .single()

    if (error) {
      console.error("[Voice Calls] Update error:", error)
      return null
    }

    return data as VoiceCall
  } catch (error) {
    console.error("[Voice Calls] Unexpected error:", error)
    return null
  }
}

export async function getCallsByLead(leadId: string): Promise<VoiceCall[]> {
  try {
    const { data, error } = await supabase
      .from("calls")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[Voice Calls] Get error:", error)
      return []
    }

    return (data || []) as VoiceCall[]
  } catch (error) {
    console.error("[Voice Calls] Unexpected error:", error)
    return []
  }
}

export async function getCallById(callId: string): Promise<VoiceCall | null> {
  try {
    const { data, error } = await supabase
      .from("calls")
      .select("*")
      .eq("id", callId)
      .single()
      
    if (error || !data) return null
    return data as VoiceCall
  } catch (error) {
    console.error("[Voice Calls] Get by id error:", error)
    return null
  }
}

export async function addCallEvent(
  callId: string, 
  eventType: string, 
  eventData: any
): Promise<void> {
  try {
    await supabase.from("call_events").insert({
      call_id: callId,
      event_type: eventType,
      event_data: eventData,
    })
  } catch (error) {
    console.error("[Call Events] Error:", error)
  }
}

/**
 * Trigger a voice call with full qualification tracking
 * Updated for Vapi-style workflows
 */
export async function triggerVoiceCall(
  leadId: string,
  callIntentStatus: string,
  scheduledTime?: string,
): Promise<void> {
  try {
    const call = await createCall(leadId, "outbound")

    if (!call) {
      console.error(`[Voice Call] Failed to create call record for lead: ${leadId}`)
      return
    }

    // Log the intent
    await addCallEvent(call.id, "call_intent_detected", {
      intent_status: callIntentStatus,
      scheduled_time: scheduledTime,
      triggered_at: new Date().toISOString(),
    })

    console.log(`[Voice Call Triggered] Call ID: ${call.id}, Lead ID: ${leadId}`)

    if (scheduledTime) {
      await addCallEvent(call.id, "call_scheduled", {
        scheduled_time: scheduledTime,
      })
    } else if (callIntentStatus === "warm_call_requested" || callIntentStatus === "ready_for_offer_call") {
      // Initiate immediately
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/twilio/voice/outbound`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ leadId }),
          }
        )

        if (!response.ok) {
          console.error(`[Voice Call] Outbound call API failed:`, await response.text())
        }
      } catch (error) {
        console.error(`[Voice Call] Error initiating outbound call:`, error)
      }
    }
  } catch (error) {
    console.error(`[Voice Call] Error triggering voice call for lead ${leadId}:`, error)
  }
}

/**
 * Get call with full qualification data (Vapi-style artifact extraction)
 */
export async function getCallWithQualification(callId: string): Promise<{
  call: VoiceCall | null
  structuredOutputs: Record<string, any>
}> {
  try {
    const call = await getCallById(callId)
    
    if (!call) {
      return { call: null, structuredOutputs: {} }
    }

    // Build Vapi-style structured outputs
    const structuredOutputs = {
      interest_level: call.interest_level,
      motivation: call.motivation,
      urgency: call.urgency,
      past_experience: call.past_experience,
      budget: call.budget,
      paid_intent: call.paid_intent,
      status: call.ended_reason === "completed" ? "complete" : "in-progress",
      offer_discussed: call.offer_discussed,
      offer_amount: call.offer_amount,
      next_steps: call.next_steps,
      sentiment: call.sentiment,
    }

    return { call, structuredOutputs }
  } catch (error) {
    console.error(`[Get Call Qualification] Error:`, error)
    return { call: null, structuredOutputs: {} }
  }
}
