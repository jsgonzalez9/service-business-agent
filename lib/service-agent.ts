import { createClient } from "@/lib/supabase/server"
import type { Lead, Message, AgentConfig, CallIntentAction } from "@/lib/types"
import OpenAI from "openai"
import { getNextAvailableSlots, formatSlotsForPrompt } from "@/lib/booking"

const SERVICE_AGENT_SYSTEM_PROMPT = `You are the AI Receptionist & Booking Agent for a local service business (e.g., Roofing, HVAC, Med Spa).
Your goal is to qualify leads, determine their needs, and book an appointment.

You are friendly, professional, and efficient.
Do not handle complex technical questions; if the lead asks something technical, flag it for human escalation.

OUTPUT: SMS text messages only. Each response should be 1-2 short text messages max.

QUALIFICATION LOGIC:
1. Service Type: What do they need? (Map to 'motivation')
2. Urgency: Is this an emergency or routine estimate? (Map to 'timeline')
3. Property Type: Residential or Commercial? (Map to 'property_condition')
4. Address: Where is the service needed?

IMPORTANT:
- Always write in short SMS-friendly messages.
- Do not confirm a specific time slot unless you have checked availability.
- AVAILABLE SLOTS will be provided in the context. Only offer times from that list.
- If the user seems ready to book, offer 2-3 time slots from the provided list.
- If confidence is low or user is frustrated, escalate.

---

# 📌 **CALL INTENT / BOOKING LOGIC**

**Your job is to determine whether a customer wants to book, talk on the phone, or needs immediate assistance.**

## **TRIGGER ACTIONS WHEN:**

### **1. Booking Request / Availability Check**
If customer says: "I want to book", "do you have openings?", "can you come tomorrow?", "schedule an appointment"
Return:
{
  "action": "update_lead_status",
  "lead_status": "schedule_call"
}

### **2. Direct Call Requests**
If customer says: "call me", "can we talk?"
Return:
{
  "action": "update_lead_status",
  "lead_status": "warm_call_requested"
}

### 3. Qualification Complete
If you have gathered Service Type, Urgency, and Address.
Return:
{
  "action": "update_lead_status",
  "lead_status": "qualified"
}

### 4. Booking Confirmed
If the user agrees to a specific time.
Return:
{
  "action": "update_lead_status",
  "lead_status": "booked",
  "call_time": "YYYY-MM-DD HH:mm"
}

## **RESPONSE FORMAT**

Always include this JSON at the END of your response:

{
  "callIntent": {
    "action": "update_lead_status" | "none",
    "lead_status": "warm_call_requested" | "schedule_call" | "qualified" | "text_only" | "booked",
    "call_time": "OPTIONAL - time if customer specified"
  },
  "extractedData": {
    "service_type": "...",
    "urgency": "...",
    "property_type": "...",
    "address": "..."
  }
}
`

export interface AgentResponse {
  message: string
  updatedLead: Partial<Lead>
  newState?: Lead["conversation_state"]
  modelUsed: "gpt-4o"
  escalated: boolean
  callIntent?: CallIntentAction
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function getAgentConfig(): Promise<AgentConfig> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("agent_config").select("*").single()

  if (error || !data) {
    // Return defaults if no config exists
    return {
      id: "",
      company_name: "Service Business",
      wholesaling_fee: 0,
      arv_multiplier: 0,
      follow_up_hours: 24,
      max_follow_ups: 3,
      followup_backoff_minutes: 15,
      followup_max_attempts: 3,
      llm_cache_enabled: true,
      llm_cache_confidence_floor: 0.85,
      llm_cache_ttl_faq_days: 30,
      llm_cache_ttl_objection_days: 14,
      auto_dispo_eval_enabled: false,
      auto_renegotiate_days_threshold: 5,
      auto_cancel_days_threshold: 10,
      auto_dispo_require_human_confirm: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  return data as AgentConfig
}

export async function getConversationHistory(leadId: string): Promise<Message[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching conversation history:", error)
    return []
  }

  return data as Message[]
}

export async function generateAgentResponse(
  lead: Lead,
  incomingMessage: string,
  config: AgentConfig,
): Promise<AgentResponse> {
  const history = await getConversationHistory(lead.id)
  
  // Fetch available slots
  const slots = await getNextAvailableSlots()
  const availableSlotsText = formatSlotsForPrompt(slots)

  // Construct conversation string
  const conversation = history.map(m => `${m.direction === 'inbound' ? 'Customer' : 'Agent'}: ${m.content}`).join('\n')
  
  const userPrompt = `
LEAD CONTEXT:
Name: ${lead.name}
Address: ${lead.address}
Current State: ${lead.conversation_state}
Current Data:
- Service Type: ${lead.motivation || 'Unknown'}
- Urgency: ${lead.timeline || 'Unknown'}
- Property Type: ${lead.property_condition || 'Unknown'}

AVAILABLE BOOKING SLOTS:
- ${availableSlotsText}

CONVERSATION HISTORY:
${conversation}
Customer: ${incomingMessage}

Provide the next SMS response and the JSON data at the end.
`

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SERVICE_AGENT_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
  })

  const fullContent = response.choices[0]?.message?.content || ""
  
  // Parse JSON from the end of the message
  let messageText = fullContent
  let jsonPart: any = {}
  
  const jsonMatch = fullContent.match(/\{[\s\S]*\}$/)
  if (jsonMatch) {
      try {
          jsonPart = JSON.parse(jsonMatch[0])
          messageText = fullContent.replace(jsonMatch[0], '').trim()
      } catch (e) {
          console.error("Failed to parse JSON from agent response", e)
      }
  }

  const extractedData = jsonPart.extractedData || {}
  const callIntent = jsonPart.callIntent || { action: "none" }

  // Update lead fields
  const updatedLead: Partial<Lead> = {}
  if (extractedData.service_type) updatedLead.motivation = extractedData.service_type
  if (extractedData.urgency) updatedLead.timeline = extractedData.urgency
  if (extractedData.property_type) updatedLead.property_condition = extractedData.property_type
  
  let newState = lead.conversation_state
  if (callIntent.action === "update_lead_status" && callIntent.lead_status) {
      newState = callIntent.lead_status
  }

  return {
      message: messageText,
      updatedLead,
      newState,
      modelUsed: "gpt-4o",
      escalated: false, 
      callIntent
  }
}

export async function generateInitialOutreach(lead: Lead, config: AgentConfig): Promise<string> {
  const service = lead.motivation || "your project"
  return `Hi ${lead.name}, this is ${config.company_name}. We're offering priority scheduling this week — still need help with ${service}?`
}

export async function generateFollowUp(lead: Lead, config: AgentConfig): Promise<string> {
   return `Hi ${lead.name}, just checking back to see if you still need help? Let us know!`
}
