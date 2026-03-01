import OpenAI from "openai"
import type { Lead } from "./types"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface VoiceAgentConfig {
  leadId: string
  phone: string
  companyName: string
  agentName: string
  mode: "inbound" | "outbound"
}

// Voice Agent System Prompt for SELLING AI Voice Agents to Local Businesses
const VOICE_AGENT_SALES_PROMPT = `You are an AI Sales Representative calling on behalf of an AI Voice Agent Solutions company.
Your job is to sell AI voice agents and automation services to local business owners and marketing agencies.

YOUR ROLE:
- For OUTBOUND calls: Introduce yourself professionally as a consultant helping businesses automate their phone operations
- Qualify if they are interested in AI voice solutions for their business or agency
- Understand their current call handling process and pain points
- Gauge interest level, budget, and decision-making authority
- Book a demo or next call with the human sales team

CRITICAL RULES:
1. Keep responses SHORT and conversational (1-2 sentences max for voice)
2. Use simple, clear language - avoid jargon like "AI" or "automation" initially
3. Lead with VALUE: "Are you tired of missing calls and losing leads?"
4. Ask open-ended questions about their current setup
5. Be ready to handle objections gracefully (cost, need, timing)
6. If they say "not interested": Thank them politely and end professionally
7. NEVER be pushy or aggressive - consultative approach only
8. Focus on OUTCOMES: "Never miss another potential customer"
9. For agencies: Emphasize adding voice AI to their service stack
10. Always offer something specific: free audit, demo, or callback

QUALIFICATION QUESTIONS (ask naturally):
- What type of business are you in?
- How do you currently handle phone calls after hours?
- Are you missing calls that could be leads/sales?
- Have you ever considered automating your call answering?
- What's your monthly call volume roughly?
- Who would make the decision about something like this?

CONVERSATION FLOW:
- Greeting & Hook (5 seconds): "Hi [Name], quick question - are you currently missing calls that could be new customers?"
- Pain Point Discovery (20-30 seconds): Ask about their current process
- Qualification (20-30 seconds): Business type, volume, decision maker
- Interest Assessment (10-20 seconds): Would they ever consider AI voice answering?
- Close (10-20 seconds): Book demo, send info, or schedule follow-up

Keep responses natural, friendly, and brief. Sound like a helpful consultant, not a salesperson.`

export async function generateVoiceResponse(
  lead: Lead,
  transcript: string,
  config: VoiceAgentConfig,
): Promise<{
  message: string
  shouldEndCall: boolean
  updatedLead: Partial<Lead>
  nextAction: string
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number }
}> {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o", // or "gpt-5.1" if available
      max_tokens: 150,
      messages: [
        { role: "system", content: VOICE_AGENT_SALES_PROMPT },
        {
          role: "user",
          content: `Lead Info:
- Name: ${lead.name}
- Business: ${lead.company_name || "Unknown"}
- Call Type: ${config.mode}
- Agent Name: ${config.agentName}

Conversation so far:
${transcript}

Generate the next response. Keep it natural, SHORT (1-2 sentences), and friendly.`,
        },
      ],
    })

    const message = response.choices[0].message.content || ""

    // Determine if call should end
    const shouldEndCall =
      message.toLowerCase().includes("goodbye") ||
      message.toLowerCase().includes("bye") ||
      message.toLowerCase().includes("take care") ||
      message.toLowerCase().includes("not interested") ||
      transcript.toLowerCase().includes("do not call") ||
      transcript.toLowerCase().includes("take me off")

    // Parse qualification data from transcript
    const updatedLead: Partial<Lead> = {}

    // Simple keyword extraction for business data
    if (transcript.toLowerCase().includes("realtor") || transcript.toLowerCase().includes("real estate")) {
      updatedLead.motivation = "Real Estate"
    } else if (transcript.toLowerCase().includes("agency") || transcript.toLowerCase().includes("marketing")) {
      updatedLead.motivation = "Marketing Agency"
    } else if (transcript.toLowerCase().includes("roofer") || transcript.toLowerCase().includes("roofing")) {
      updatedLead.motivation = "Roofing"
    } else if (transcript.toLowerCase().includes("hvac") || transcript.toLowerCase().includes("ac")) {
      updatedLead.motivation = "HVAC"
    } else if (transcript.toLowerCase().includes("med spa") || transcript.toLowerCase().includes("salon")) {
      updatedLead.motivation = "Medical Spa/Beauty"
    }

    // Interest level - map to valid conversation states
    if (transcript.toLowerCase().includes("interested") || transcript.toLowerCase().includes("tell me more")) {
      updatedLead.conversation_state = "qualified"
    } else if (transcript.toLowerCase().includes("demo") || transcript.toLowerCase().includes("call back")) {
      updatedLead.conversation_state = "schedule_call"
    } else if (transcript.toLowerCase().includes("not interested") || transcript.toLowerCase().includes("no thanks")) {
      updatedLead.conversation_state = "lost"
    }

    return {
      message,
      shouldEndCall,
      updatedLead,
      nextAction: shouldEndCall ? "end_call" : "continue",
      usage: response.usage as any,
    }
  } catch (error) {
    console.error("[Voice Agent Sales] Error:", error)
    return {
      message: "I apologize, I'm having trouble hearing you. Let me have my team call you back. What time works best?",
      shouldEndCall: true,
      updatedLead: {},
      nextAction: "end_call",
    }
  }
}

export async function extractCallInsights(
  transcript: string,
  lead: Lead,
): Promise<{
  summary: string
  sentiment: "positive" | "neutral" | "negative"
  demoRequested: boolean
  nextSteps: string
  leadUpdates: Partial<Lead>
}> {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 500,
      messages: [
        { role: "system", content: "Extract sales call insights for an AI voice agent sales call." },
        {
          role: "user",
          content: `Analyze this call transcript for an AI voice agent sales call:

TRANSCRIPT:
${transcript}

LEAD INFO:
Name: ${lead.name}
Company: ${lead.company_name || "Unknown"}

Extract and provide as JSON:
1. summary (string) - brief 2-sentence summary
2. sentiment (string) - "positive", "neutral", or "negative"
3. demoRequested (boolean) - did they agree to a demo/callback?
4. businessType (string) - what type of business do they have?
5. interestLevel (string) - "high", "medium", "low", "none"
6. decisionMaker (string) - are they the decision maker? "yes", "no", "unknown"
7. objections (array of strings) - any objections raised
8. nextSteps (string) - what should happen next

Format as JSON only.`,
        },
      ],
    })

    const content = response.choices[0].message.content || "{}"
    
    let insights
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      insights = jsonMatch ? JSON.parse(jsonMatch[0]) : {}
    } catch {
      insights = {}
    }

    const leadUpdates: Partial<Lead> = {}
    
    if (insights.businessType) {
      leadUpdates.motivation = insights.businessType
    }
    if (insights.interestLevel) {
      leadUpdates.timeline = insights.interestLevel // repurposing field
    }

    return {
      summary: insights.summary || "Call completed",
      sentiment: insights.sentiment || "neutral",
      demoRequested: insights.demoRequested || false,
      nextSteps: insights.nextSteps || "Follow up required",
      leadUpdates,
    }
  } catch (error) {
    console.error("[Voice Agent Sales] Error extracting insights:", error)
    return {
      summary: "Call completed",
      sentiment: "neutral",
      demoRequested: false,
      nextSteps: "Follow up required",
      leadUpdates: {},
    }
  }
}
