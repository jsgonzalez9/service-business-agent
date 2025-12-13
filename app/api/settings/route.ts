import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    // Check if config exists
    const { data: existing } = await supabase.from("agent_config").select("id").single()

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from("agent_config")
        .update({
          company_name: body.company_name,
          wholesaling_fee: body.wholesaling_fee,
          arv_multiplier: body.arv_multiplier,
          follow_up_hours: body.follow_up_hours,
          max_follow_ups: body.max_follow_ups,
          followup_backoff_minutes: body.followup_backoff_minutes ?? 15,
          followup_max_attempts: body.followup_max_attempts ?? 3,
          llm_cache_enabled: typeof body.llm_cache_enabled === "boolean" ? body.llm_cache_enabled : true,
          llm_cache_confidence_floor: typeof body.llm_cache_confidence_floor === "number" ? body.llm_cache_confidence_floor : 0.85,
          llm_cache_ttl_faq_days: typeof body.llm_cache_ttl_faq_days === "number" ? body.llm_cache_ttl_faq_days : 30,
          llm_cache_ttl_objection_days: typeof body.llm_cache_ttl_objection_days === "number" ? body.llm_cache_ttl_objection_days : 14,
          auto_dispo_eval_enabled: typeof body.auto_dispo_eval_enabled === "boolean" ? body.auto_dispo_eval_enabled : true,
          auto_renegotiate_days_threshold: typeof body.auto_renegotiate_days_threshold === "number" ? body.auto_renegotiate_days_threshold : 5,
          auto_cancel_days_threshold: typeof body.auto_cancel_days_threshold === "number" ? body.auto_cancel_days_threshold : 10,
          auto_dispo_require_human_confirm: typeof body.auto_dispo_require_human_confirm === "boolean" ? body.auto_dispo_require_human_confirm : true,
          updated_at: new Date().toISOString(),
          llm_cache_market_overrides: body.llm_cache_market_overrides ?? {},
        })
        .eq("id", existing.id)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    } else {
      // Insert new
      const { error } = await supabase.from("agent_config").insert({
        company_name: body.company_name,
        wholesaling_fee: body.wholesaling_fee,
        arv_multiplier: body.arv_multiplier,
        follow_up_hours: body.follow_up_hours,
        max_follow_ups: body.max_follow_ups,
        followup_backoff_minutes: body.followup_backoff_minutes ?? 15,
        followup_max_attempts: body.followup_max_attempts ?? 3,
        llm_cache_enabled: typeof body.llm_cache_enabled === "boolean" ? body.llm_cache_enabled : true,
        llm_cache_confidence_floor: typeof body.llm_cache_confidence_floor === "number" ? body.llm_cache_confidence_floor : 0.85,
        llm_cache_ttl_faq_days: typeof body.llm_cache_ttl_faq_days === "number" ? body.llm_cache_ttl_faq_days : 30,
        llm_cache_ttl_objection_days: typeof body.llm_cache_ttl_objection_days === "number" ? body.llm_cache_ttl_objection_days : 14,
        auto_dispo_eval_enabled: typeof body.auto_dispo_eval_enabled === "boolean" ? body.auto_dispo_eval_enabled : true,
        auto_renegotiate_days_threshold: typeof body.auto_renegotiate_days_threshold === "number" ? body.auto_renegotiate_days_threshold : 5,
        auto_cancel_days_threshold: typeof body.auto_cancel_days_threshold === "number" ? body.auto_cancel_days_threshold : 10,
        auto_dispo_require_human_confirm: typeof body.auto_dispo_require_human_confirm === "boolean" ? body.auto_dispo_require_human_confirm : true,
        llm_cache_market_overrides: body.llm_cache_market_overrides ?? {},
      })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving settings:", error)
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  }
}
