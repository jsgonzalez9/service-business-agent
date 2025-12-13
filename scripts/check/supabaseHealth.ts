import { createClient } from "@supabase/supabase-js"

type Check = { name: string; ok: boolean; details?: string }

async function tableExists(supabase: any, table: string): Promise<boolean> {
  try {
    const { error } = await supabase.from(table).select("id").limit(1)
    return !error
  } catch {
    return false
  }
}

async function columnExists(supabase: any, table: string, column: string): Promise<boolean> {
  try {
    const { error } = await supabase.from(table).select(column).limit(1)
    return !error
  } catch {
    return false
  }
}

async function run() {
  const url = process.env.SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  if (!url || !key) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    process.exit(1)
  }
  const supabase = createClient(url, key)

  const checks: Check[] = []
  const ensure = async (name: string, ok: boolean, details?: string) => checks.push({ name, ok, details })

  // Core tables
  ensure("leads table", await tableExists(supabase, "leads"))
  for (const col of [
    "name",
    "phone_number",
    "address",
    "state",
    "conversation_state",
    "last_message_at",
    "dispo_started_at",
    "offers_received",
    "best_assignment_fee",
    "winning_buyer_id",
    "assignment_pdf_path",
    "dispo_status",
    "deal_state",
    "state_history",
    "offer_amount",
  ]) {
    ensure(`leads.${col}`, await columnExists(supabase, "leads", col))
  }

  ensure("messages table", await tableExists(supabase, "messages"))
  for (const col of ["lead_id", "direction", "content", "twilio_sid", "model_used", "was_escalated", "created_at"]) {
    ensure(`messages.${col}`, await columnExists(supabase, "messages", col))
  }

  ensure("agent_config table", await tableExists(supabase, "agent_config"))
  for (const col of [
    "llm_cache_enabled",
    "llm_cache_confidence_floor",
    "llm_cache_ttl_faq_days",
    "llm_cache_ttl_objection_days",
    "llm_cache_market_overrides",
    "auto_dispo_eval_enabled",
    "auto_renegotiate_days_threshold",
    "auto_cancel_days_threshold",
    "auto_dispo_require_human_confirm",
  ]) {
    ensure(`agent_config.${col}`, await columnExists(supabase, "agent_config", col))
  }

  ensure("cached_responses table", await tableExists(supabase, "cached_responses"))
  for (const col of ["normalized_question", "canonical_question", "response_text", "embedding", "usage_count", "market", "updated_at"]) {
    ensure(`cached_responses.${col}`, await columnExists(supabase, "cached_responses", col))
  }
  ensure("cached_hits table", await tableExists(supabase, "cached_hits"))

  ensure("buyers table", await tableExists(supabase, "buyers"))
  ensure("buyer_interests table", await tableExists(supabase, "buyer_interests"))
  ensure("buyer_broadcasts table", await tableExists(supabase, "buyer_broadcasts"))
  ensure("buyer_offers table", await tableExists(supabase, "buyer_offers"))

  ensure("calls table", await tableExists(supabase, "calls"))
  ensure("call_events table", await tableExists(supabase, "call_events"))
  ensure("call_summaries table", await tableExists(supabase, "call_summaries"))

  ensure("sms_events table", await tableExists(supabase, "sms_events"))
  ensure("consents table", await tableExists(supabase, "consents"))

  ensure("sequences table", await tableExists(supabase, "sequences"))
  ensure("sequence_steps table", await tableExists(supabase, "sequence_steps"))
  ensure("lead_sequences table", await tableExists(supabase, "lead_sequences"))
  ensure("lead_sequence_steps table", await tableExists(supabase, "lead_sequence_steps"))
  ensure("sequence_runs table", await tableExists(supabase, "sequence_runs"))

  ensure("contract_templates table", await tableExists(supabase, "contract_templates"))
  ensure("contract_instances table", await tableExists(supabase, "contract_instances"))

  const failed = checks.filter((c) => !c.ok)
  console.log("Supabase Health Report")
  for (const c of checks) {
    console.log(`${c.ok ? "OK" : "MISS"} - ${c.name}${c.details ? `: ${c.details}` : ""}`)
  }
  if (failed.length > 0) {
    process.exitCode = 1
  }
}

run().catch((e) => {
  console.error("Health check failed:", e)
  process.exit(1)
})
