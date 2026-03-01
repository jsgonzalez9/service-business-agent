ALTER TABLE agent_config
  ADD COLUMN IF NOT EXISTS llm_cache_enabled BOOLEAN DEFAULT true;
