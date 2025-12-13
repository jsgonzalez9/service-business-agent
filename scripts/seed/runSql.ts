import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

async function run() {
  const url = process.env.SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  if (!url || !key) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    process.exit(1)
  }
  const supabase = createClient(url, key)
  const files = [
    "001_create_leads_table.sql",
    "002_create_messages_table.sql",
    "003_create_agent_config_table.sql",
    "004_add_model_tracking.sql",
    "005_create_call_tracking.sql",
    "006_create_followup_sequences.sql",
    "007_create_sms_events.sql",
    "008_alter_leads_optout.sql",
    "009_create_a2p_tables.sql",
    "010_alter_followup_queue.sql",
    "011_alter_agent_config_followup.sql",
    "012_alter_leads_mortgage.sql",
    "013_create_conversation_summaries.sql",
    "014_create_property_photos.sql",
    "015_alter_followup_reason_next.sql",
    "016_create_consents.sql",
    "017_alter_leads_consent.sql",
    "018_create_call_summaries.sql",
    "019_alter_call_summaries_details.sql",
    "020_create_sequences.sql",
    "021_alter_lead_sequences_retry.sql",
    "024_create_sequence_runs.sql",
    "025_create_contracts.sql",
    "026_alter_leads_state.sql",
    "027_create_cached_responses.sql",
    "027b_create_cached_responses_json.sql",
    "027c_alter_cached_responses_intent.sql",
    "028_alter_leads_state_machine.sql",
    "029_buyers.sql",
    "030_alter_cached_responses_embeddings.sql",
    "031_alter_agent_config_llm_cache.sql",
    "032_alter_agent_config_llm_cache_policy.sql",
    "033_alter_agent_config_market_overrides.sql",
    "034_alter_leads_dispo_fields.sql",
    "035_alter_agent_config_auto_dispo.sql",
    "036_create_buyer_broadcasts.sql",
    "037_create_buyer_offers.sql",
    "038_alter_leads_assignment.sql",
    "039_alter_leads_add_state.sql",
    "040_alter_leads_dispo_review.sql",
    "041_alter_leads_buyer_contract.sql",
    "042_alter_contract_templates_docuseal.sql",
    "043_alter_contract_templates_direct_link.sql",
  ]
  for (const f of files) {
    const p = path.join(process.cwd(), "scripts", f)
    if (!fs.existsSync(p)) {
      console.log(`Skip missing: ${f}`)
      continue
    }
    const sql = fs.readFileSync(p, "utf-8")
    console.log(`Executing ${f}...`)
    const { error } = await supabase.rpc("exec", { sql_query: sql } as any)
    if (error) console.error(`Error ${f}:`, error)
    else console.log(`Done ${f}`)
  }
  console.log("SQL execution finished")
}

run().catch((e) => {
  console.error("Run failed:", e)
  process.exit(1)
})
