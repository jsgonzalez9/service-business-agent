ALTER TABLE agent_config
  ADD COLUMN IF NOT EXISTS llm_cache_confidence_floor NUMERIC DEFAULT 0.85,
  ADD COLUMN IF NOT EXISTS llm_cache_ttl_faq_days INTEGER DEFAULT 30,
  ADD COLUMN IF NOT EXISTS llm_cache_ttl_objection_days INTEGER DEFAULT 14;
