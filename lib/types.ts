export type ConversationState =
  | "cold_lead"
  | "contacted"
  | "qualified"
  | "offer_made"
  | "offer_accepted"
  | "contract_sent"
  | "contract_signed"
  | "closed"
  | "lost"
  | "warm_call_requested"
  | "schedule_call"
  | "ready_for_offer_call"
  | "text_only"
  | "booked"

export interface Lead {
  id: string
  business_id?: string | null
  name: string
  phone_number: string
  address: string
  state?: string | null
  notes: string | null
  property_condition: string | null
  motivation: string | null
  timeline: string | null
  price_expectation: number | null
  mortgage_owed?: number | null
  arv: number | null
  repair_estimate: number | null
  offer_amount: number | null
  conversation_state: ConversationState
  contract_link: string | null
  last_message_at: string | null
  follow_up_count: number
  pipeline_status?: "NEW" | "WARM" | "HOT" | "DEAD" | "FOLLOW-UP"
  tags?: string[] | null
  score?: number
  score_updated_at?: string | null
  deal_state?: "NEW" | "CONTACTED" | "QUALIFIED" | "OFFER_SENT" | "NEGOTIATING" | "AGREED" | "CONTRACTED" | "DISPO" | "CLOSED" | "DEAD"
  offer_attempts?: number
  last_offer_amount?: number | null
  is_opted_out?: boolean
  opted_out_at?: string | null
  optout_reason?: string | null
  created_at: string
  updated_at: string
  assignment_pdf_path?: string | null
  best_assignment_fee?: number | null
  winning_buyer_id?: string | null
  buyer_price?: number | null
  buyer_contract_pdf_path?: string | null
  seller_contract_status?: string | null
  seller_contract_envelope_id?: string | null
  seller_contract_signed_url?: string | null
  buyer_contract_status?: string | null
  buyer_contract_envelope_id?: string | null
  buyer_contract_signed_url?: string | null
  dispo_reviewed?: boolean | null
  dispo_reviewed_at?: string | null
  dispo_started_at?: string | null
  offers_received?: number | null
  dispo_status?: string | null
  state_history?: any | null
  company_name?: string | null
}

export interface Message {
  id: string
  lead_id: string
  direction: "inbound" | "outbound"
  content: string
  twilio_sid: string | null
  model_used: "gpt-5-mini" | "gpt-4.0-mini" | "gpt-5" | "gpt-5.1" | "gpt-4o" | null
  was_escalated: boolean | null
  created_at: string
}

export interface AgentConfig {
  id: string
  company_name: string
  wholesaling_fee: number
  arv_multiplier: number
  follow_up_hours: number
  max_follow_ups: number
  followup_backoff_minutes?: number
  followup_max_attempts?: number
  llm_cache_enabled?: boolean
  llm_cache_confidence_floor?: number
  llm_cache_ttl_faq_days?: number
  llm_cache_ttl_objection_days?: number
  llm_cache_market_overrides?: Record<string, { confidence_floor?: number; ttl_faq_days?: number; ttl_objection_days?: number }>
  auto_dispo_eval_enabled?: boolean
  auto_renegotiate_days_threshold?: number
  auto_cancel_days_threshold?: number
  auto_dispo_require_human_confirm?: boolean
  created_at: string
  updated_at: string
}

export interface VoiceCall {
  id: string
  lead_id: string
  call_type: "inbound" | "outbound"
  call_status: "pending" | "ringing" | "in_progress" | "completed" | "failed" | "no_answer"
  twilio_call_sid: string | null
  duration_seconds: number | null
  transcript: string | null
  summary: string | null
  offer_discussed: boolean
  offer_amount: number | null
  next_steps: string | null
  model_used: string
  sentiment: "positive" | "neutral" | "negative" | null
  // Voice Qualification Fields (Task #3)
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

export interface CallIntentAction {
  action: "none" | "update_lead_status"
  lead_status?: ConversationState
  call_time?: string
}
