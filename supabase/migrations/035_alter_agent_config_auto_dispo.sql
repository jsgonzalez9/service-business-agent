ALTER TABLE agent_config
  ADD COLUMN IF NOT EXISTS auto_dispo_eval_enabled BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS auto_renegotiate_days_threshold INTEGER DEFAULT 5,
  ADD COLUMN IF NOT EXISTS auto_cancel_days_threshold INTEGER DEFAULT 10,
  ADD COLUMN IF NOT EXISTS auto_dispo_require_human_confirm BOOLEAN DEFAULT true;
