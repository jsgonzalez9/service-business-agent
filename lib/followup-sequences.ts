"use server"

import { createClient } from "@/lib/supabase/server"
import { getAgentConfig } from "@/lib/service-agent"

// Service Business Follow-up Sequence
const FOLLOWUP_MESSAGES = [
  {
    day: 1,
    message: "Hi [NAME], just checking back — did you still need help with [SERVICE_TYPE]? We have openings this week.",
  },
  {
    day: 3,
    message: "Hey [NAME], we offer free estimates and a 100% satisfaction guarantee. Let me know if you want to get this sorted!",
  },
  {
    day: 5,
    message: "Check out what our neighbors are saying: 'Best service in town!' ⭐⭐⭐⭐⭐. We'd love to help you too.",
  },
  {
    day: 7,
    message: "I don't want to bother you! I'll close this file for now, but feel free to text back if you need us later.",
  },
]

export async function scheduleFollowUpSequence(
  leadId: string,
  meta?: { reason?: string; next_action?: string },
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  try {
    // Get the lead
    const { data: lead, error: leadError } = await supabase.from("leads").select("*").eq("id", leadId).single()

    if (leadError || !lead) {
      return { success: false, error: "Lead not found" }
    }

    // Create follow-up sequence entries
    const sequenceEntries = FOLLOWUP_MESSAGES.map((msg, index) => {
      const scheduledDate = new Date()
      scheduledDate.setDate(scheduledDate.getDate() + msg.day)
      scheduledDate.setHours(9, 0, 0, 0) // Schedule for 9 AM

      return {
        lead_id: leadId,
        sequence_number: index + 1,
        scheduled_for: scheduledDate.toISOString(),
        status: "pending",
        attempts: 0,
        next_attempt_at: null,
        reason: meta?.reason || null,
        next_action: meta?.next_action || null,
      }
    })

    const { error: insertError } = await supabase.from("follow_up_sequences").insert(sequenceEntries)

    if (insertError) {
      return { success: false, error: insertError.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getPendingFollowUps(limit = 50): Promise<
  Array<{
    id: string
    lead_id: string
    lead_name: string
    phone_number: string
    address: string
    sequence_number: number
    message: string
    scheduled_for: string
    attempts: number
  }>
> {
  const supabase = await createClient()

  const now = new Date().toISOString()
  const agentCfg = await getAgentConfig()
  const maxAttempts = Number(agentCfg.followup_max_attempts ?? process.env.FOLLOWUP_MAX_ATTEMPTS ?? 3)

  const { data, error } = await supabase
    .from("follow_up_sequences")
    .select(
      `
      id,
      lead_id,
      sequence_number,
      scheduled_for,
      attempts,
      next_attempt_at,
      leads(name, phone_number, address, motivation)
    `,
    )
    .eq("status", "pending")
    .lte("scheduled_for", now)
    .lt("attempts", maxAttempts)
    .or(`next_attempt_at.is.null,next_attempt_at.lte.${now}`)
    .limit(limit)
    .order("scheduled_for", { ascending: true })

  if (error) {
    console.error("Error fetching pending follow-ups:", error)
    return []
  }

  // Map the response to include message content
  return (data || []).map((item: any) => {
      let msg = FOLLOWUP_MESSAGES[item.sequence_number - 1]?.message || "Just checking in!"
      
      const name = item.leads?.name || "there"
      const serviceType = item.leads?.motivation || "your project" // Mapping motivation to Service Type
      const address = item.leads?.address || ""
      
      msg = msg.replace("[NAME]", name)
      msg = msg.replace("[SERVICE_TYPE]", serviceType)
      msg = msg.replace("[ADDRESS]", address)
      
      return {
        id: item.id,
        lead_id: item.lead_id,
        lead_name: item.leads?.name || "Unknown",
        phone_number: item.leads?.phone_number || "",
        address: item.leads?.address || "",
        sequence_number: item.sequence_number,
        message: msg,
        scheduled_for: item.scheduled_for,
        attempts: item.attempts || 0,
      }
  })
}

export async function markFollowUpAsSent(sequenceId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("follow_up_sequences")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", sequenceId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function markFollowUpFailed(sequenceId: string, reason: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // Proper increment logic:
  const { data } = await supabase.from("follow_up_sequences").select("attempts").eq("id", sequenceId).single()
  const attempts = (data?.attempts || 0) + 1
  
  const { error: updateError } = await supabase.from("follow_up_sequences").update({
      attempts: attempts,
      next_attempt_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
  }).eq("id", sequenceId)

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  return { success: true }
}

export async function skipFollowUp(sequenceId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.from("follow_up_sequences").update({ status: "skipped" }).eq("id", sequenceId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function getLeadFollowUpSequence(leadId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("follow_up_sequences")
    .select("*")
    .eq("lead_id", leadId)
    .order("sequence_number", { ascending: true })

  if (error) {
    console.error("Error fetching follow-up sequence:", error)
    return []
  }
  
  return data
}
