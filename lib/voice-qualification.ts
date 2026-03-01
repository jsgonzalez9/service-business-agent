/**
 * Task #2: Structured Output Extraction
 * Extracts qualification fields from voice call transcripts
 * Vapi "Elliot" standard implementation
 */

import OpenAI from "openai"
import { updateCall } from "./voice-call-actions"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export interface QualificationExtraction {
  interest_level: "high" | "medium" | "low" | "none"
  interest_confirmed: boolean
  motivation: string
  urgency: "this_week" | "this_month" | "this_quarter" | "later" | "unknown"
  past_experience: string
  budget: "confirmed" | "discussed" | "not_discussed" | "no_budget"
  paid_intent: boolean
  ended_reason: "completed" | "voicemail" | "wrong_number" | "not_interested" | "callback_requested" | "max_duration"
}

/**
 * Extract structured qualification data from call transcript
 * Called after call ends
 */
export async function extractCallQualification(
  callId: string,
  transcript: string
): Promise<QualificationExtraction | null> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are analyzing a voice call transcript between an AI voice agent and a lead. Extract qualification fields accurately.

Return ONLY valid JSON with this exact structure:
{
  "interest_level": "high" | "medium" | "low" | "none",
  "interest_confirmed": boolean,
  "motivation": string (1-2 sentences on why they want this),
  "urgency": "this_week" | "this_month" | "this_quarter" | "later" | "unknown",
  "past_experience": string (summarize any prior AI/automation experience),  
  "budget": "confirmed" | "discussed" | "not_discussed" | "no_budget",
  "paid_intent": boolean (willing to pay for discovery?),
  "ended_reason": "completed" | "voicemail" | "wrong_number" | "not_interested" | "callback_requested" | "max_duration"
}

RULES FOR ended_reason:
- "wrong_number": If they said "wrong number" or "not [name]" anywhere
- "not_interested": If they said "not interested", "stop calling", "remove me"
- "callback_requested": If they mentioned a time to call back
- "voicemail": If transcript shows voicemail beep/tone or leaving a message
- "max_duration": If transcript ends abruptly or seems cut off
- "completed": Normal conversation completion with answers gathered

RULES FOR interest_level:
- "high": They're engaged, asking questions, want next steps
- "medium": Some interest but hesitant or unclear
- "low": Minimal engagement, short answers, no enthusiasm  
- "none": Explicitly stated not interested

RULES FOR paid_intent:
- true: They agreed to pay for scoping or mentioned budget approval
- false: They declined or sounded hesitant about paying

Be conservative - only mark true if explicitly confirmed.`
        },
        { role: "user", content: transcript }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    })

    const jsonContent = response.choices[0].message.content
    if (!jsonContent) throw new Error("No content from OpenAI")

    const extraction = JSON.parse(jsonContent) as QualificationExtraction

    // Update call record with structured outputs
    await updateCall(callId, {
      interest_level: extraction.interest_level,
      ended_reason: extraction.ended_reason,
      motivation: extraction.motivation,
      urgency: extraction.urgency,
      past_experience: extraction.past_experience,
      budget: extraction.budget,
      paid_intent: extraction.paid_intent
    })

    console.log(`[Qualification] Call ${callId} extracted:`, {
      interest_level: extraction.interest_level,
      ended_reason: extraction.ended_reason,
      paid_intent: extraction.paid_intent
    })

    return extraction

  } catch (error) {
    console.error(`[Qualification] Extraction failed for ${callId}:`, error)
    return null
  }
}

/**
 * Quick extraction for real-time analysis (lighter weight)
 * Updates call record but returns immediately
 */
export async function quickExtractQualification(
  callId: string,
  transcript: string
): Promise<void> {
  // Use same extraction but don't wait
  extractCallQualification(callId, transcript).catch(err => {
    console.error(`[Quick Extract] Failed for ${callId}:`, err)
  })
}

/**
 * Determine ended reason from call status and transcript
 * Lightweight rule-based detection
 */
export function detectEndedReason(
  callStatus: string,
  transcript: string
): string {
  const lowerTranscript = transcript.toLowerCase()
  
  if (lowerTranscript.includes("wrong number") || 
      lowerTranscript.includes("not ") && lowerTranscript.includes("there")) {
    return "wrong_number"
  }
  
  if (lowerTranscript.includes("not interested") || 
      lowerTranscript.includes("stop calling") ||
      lowerTranscript.includes("remove me") ||
      lowerTranscript.includes("do not call")) {
    return "not_interested"
  }
  
  if (lowerTranscript.includes("call back") || 
      lowerTranscript.includes("call me back") ||
      lowerTranscript.includes("later")) {
    return "callback_requested"
  }
  
  if (lowerTranscript.includes("voicemail") || 
      lowerTranscript.includes("beep") ||
      callStatus === "no_answer") {
    return "voicemail"
  }
  
  if (callStatus === "completed") {
    return "completed"
  }
  
  return "completed"
}