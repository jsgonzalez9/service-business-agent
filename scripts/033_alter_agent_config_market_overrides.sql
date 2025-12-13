ALTER TABLE agent_config
  ADD COLUMN IF NOT EXISTS llm_cache_market_overrides JSONB DEFAULT '{}'::jsonb;
