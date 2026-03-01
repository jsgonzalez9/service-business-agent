/**
 * Task #1: Updated Voice Prompt with AI Disclosure
 * Vapi "Elliot" style voice agent with qualification sequence
 */

import OpenAI from "openai"
import type { Lead } from "./types"
import { extractCallQualification } from "./voice-qualification"
import { updateCall } from "./voice-call-actions"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface VoiceVariables {
  lead_name: string
  lead_company_name: string
  lead_request: string
}

export interface VoiceAgentConfig {
  leadId: string
  phone: string
  companyName: string
  agentName: string
  mode: "inbound" | "outbound"
}

/**
 * Build the voice agent system prompt with AI disclosure
 * Task #1: AI must introduce itself in first 10 seconds
 */
export function buildVoiceSystemPrompt(vars: VoiceVariables, config: VoiceAgentConfig): string {
  const { agentName, companyName, mode } = config
  
  return `You are ${agentName}, an AI voice agent calling on behalf of ${companyName}.

CRITICAL RULES - MUST FOLLOW:
1. FIRST MESSAGE: "Hi, this is ${agentName}, an AI assistant calling from ${companyName}. Is this ${vars.lead_name}${vars.lead_company_name ? ` with ${vars.lead_company_name}` : ""}?"
2. WAIT for them to respond before continuing
3. If WRONG NUMBER: "I apologize for the confusion. Have a great day." → End the conversation
4. If BAD TIME: "I understand. When would be a better time to call back?" → Note the time
5. NEVER pretend to be human - always acknowledge you're an AI assistant
6. Keep responses SHORT (1-2 sentences max for voice)
7. Speak naturally and conversationally
8. One question at a time - WAIT for them to answer

${mode === "outbound" ? `OUTBOUND CONTEXT:
They're expecting a call about: ${vars.lead_request}

QUALIFICATION SEQUENCE (Ask ONE at a time, wait for response):
1. CONFIRM INTEREST: "I see you're interested in ${vars.lead_request}. Is that right?"
2. MOTIVATION: "What prompted you to look into this now?"
3. URGENCY/TIMELINE: "What's your ideal timeline for getting this implemented?"
4. PAST EXPERIENCE: "Have you worked with any AI or automation solutions before?"
5. BUDGET: "Do you have a budget in mind for this kind of solution?"
6. PAID INTENT: "We typically start with a paid discovery session to scope out your needs. Are you open to that?"
` : `INBOUND CONTEXT:
They called you. Be welcoming and helpful.
`}

BEHAVIOR:
- Listen more than you talk
- Ask clarifying questions if answers are vague
- Don't sell - just qualify
- Be respectful if they want to end the call
- If they get confused: "I apologize for any confusion. Let me simplify - [restate simply]"

END CALL WHEN ANY OF THESE OCCUR:
- They confirm it's a wrong number
- They say "not interested", "stop calling", "remove me", "DNC"
- You've gathered answers to all qualification questions
- They become confused or frustrated
- Call exceeds 5 minutes

STANDARD ENDING:
"Thank you so much for your time${vars.lead_name ? `, ${vars.lead_name}` : ""}. I've got everything I need. Someone from the team will follow up. Have a great day!"

ACTION SIGNALS (include these in your response to end correctly):
- For wrong number: include [ACTION: END_WRONG_NUMBER]
- For not interested: include [ACTION: END_NOT_INTERESTED]
- For callback: include [ACTION: SCHEDULE_CALLBACK: time]
- For normal end: include [ACTION: END_CALL]`
}

/**
 * Generate voice response with proper context
 * Updated with AI disclosure requirement
 */
export async function generateVoiceResponse(
  lead: Lead,
  transcript: string,
  config: VoiceAgentConfig,
): Promise<{
  message: string
  shouldEndCall: boolean
  action?: "end" | "schedule_callback" | "continue"
  callbackTime?: string
  updatedLead: Partial<Lead>
  nextAction: string
}> {
  try {
    // Build personalized prompt
    const systemPrompt = buildVoiceSystemPrompt(
      {
        lead_name: lead.name || "there",
        lead_company_name: lead.company_name || "",
        lead_request: lead.motivation || "automation services",
      },
      config
    )

    // Get conversation history from transcript
    const recentTranscript = transcript.slice(-1000) // Keep last 1000 chars

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 150,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Lead Information:
Name: ${lead.name}
Company: ${lead.company_name || "Unknown"}
Previous Context: ${lead.motivation || "None"}

Conversation so far:
${recentTranscript}

Generate your next response following the rules above.`,
        },
      ],
      temperature: 0.7,
    })

    const rawMessage = response.choices[0].message.content || ""

    // Parse action signals
    let action: "end" | "schedule_callback" | "continue" = "continue"
    let callbackTime: string | undefined
    let message = rawMessage

    if (rawMessage.includes("[ACTION: END_WRONG_NUMBER]")) {
      action = "end"
      message = "I apologize for the confusion. Have a great day."
    } else if (rawMessage.includes("[ACTION: END_NOT_INTERESTED]")) {
      action = "end"
      message = "I understand. Thank you for your time. Have a great day."
    } else if (rawMessage.includes("[ACTION: END_CALL]")) {
      action = "end"
      message = rawMessage.replace(/\[ACTION:[^\]]+\]/g, "").trim()
    } else if (rawMessage.includes("[ACTION: SCHEDULE_CALLBACK:")) {
      action = "schedule_callback"
      const match = rawMessage.match(/\[ACTION: SCHEDULE_CALLBACK:\s*([^\]]+)\]/)
      callbackTime = match ? match[1] : "later"
      message = "Thank you. I'll schedule a callback for then."
    }

    // Clean up action markers from final message
    message = message.replace(/\[ACTION:[^\]]+\]/g, "").trim()

    // Determine if call should end
    const shouldEndCall = action === "end"

    // Track lead updates
    const updatedLead: Partial<Lead> = {}

    return {
      message,
      shouldEndCall,
      action,
      callbackTime,
      updatedLead,
      nextAction: shouldEndCall ? "end_call" : "continue",
    }
  } catch (error) {
    console.error("[Voice Agent] Error generating response:", error)
    throw error
  }
}

/**
 * Process call completion and extract all structured data
 * Called when call ends
 */
export async function processCallCompletion(
  callId: string,
  transcript: string,
  callStatus: string,
  duration: number
): Promise<void> {
  try {
    // Update basic call info
    await updateCall(callId, {
      call_status: callStatus === "completed" ? "completed" : callStatus,
      duration_seconds: duration,
      transcript: transcript,
    })

    // Extract structured qualifications
    if (transcript) {
      await extractCallQualification(callId, transcript)
    }

    console.log(`[Call Complete] Processed call ${callId}, duration: ${duration}s`)
  } catch (error) {
    console.error(`[Call Complete] Error processing call ${callId}:`, error)
  }
}
