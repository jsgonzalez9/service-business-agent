import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST() {
  try {
    const cookieStore = await cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ success: false, error: "Missing Supabase credentials" }, { status: 400 })
    }

    const supabase = createServerClient(supabaseUrl, supabaseServiceKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {},
      },
    })

    const sqlFiles = [
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

    const executed: Record<string, boolean> = {}

    for (const file of sqlFiles) {
      const filePath = path.join(process.cwd(), "scripts", file)
      if (!fs.existsSync(filePath)) {
        console.error(`[v0] SQL file not found: ${filePath}`)
        executed[file] = false
        continue
      }

      const sql = fs.readFileSync(filePath, "utf-8")

      try {
        const { error } = await supabase.rpc("exec", {
          sql_query: sql,
        })

        if (error) {
          console.error(`[v0] Error executing ${file}:`, error)
          executed[file] = false
        } else {
          executed[file] = true
        }
      } catch (err) {
        console.error(`[v0] Exception executing ${file}:`, err)
        executed[file] = false
      }
    }

    return NextResponse.json({ success: true, executed })
  } catch (error) {
    console.error("[v0] Migration error:", error)
    return NextResponse.json({ success: false, error: "Failed to run migrations", executed: {} }, { status: 500 })
  }
}
