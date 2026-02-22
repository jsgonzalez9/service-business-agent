-- Migration to add Multi-tenancy support
-- Run this in Supabase SQL Editor

-- 1. Create businesses table (or use agent_config as the business profile)
CREATE TABLE IF NOT EXISTS businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add business_id to leads
ALTER TABLE leads ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);

-- 3. Add business_id to messages
ALTER TABLE messages ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);

-- 4. Add business_id to follow_up_sequences
ALTER TABLE follow_up_sequences ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);

-- 5. Add business_id to agent_config
ALTER TABLE agent_config ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);

-- 6. Enable RLS on businesses
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- 7. Update RLS policies for leads to check business_id
-- (Example Policy - needs actual user mapping)
-- CREATE POLICY "Users can view their business leads" ON leads
-- FOR SELECT USING (business_id IN (SELECT business_id FROM user_businesses WHERE user_id = auth.uid()));

-- For now, we assume the application passes the business_id in the context or queries.
