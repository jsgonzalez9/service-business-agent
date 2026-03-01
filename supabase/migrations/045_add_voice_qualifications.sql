-- Add voice qualification columns to calls table
-- Task #3: Update database schema for structured outputs

ALTER TABLE calls 
ADD COLUMN IF NOT EXISTS interest_level TEXT CHECK (interest_level IN ('high', 'medium', 'low', 'none')),
ADD COLUMN IF NOT EXISTS motivation TEXT,
ADD COLUMN IF NOT EXISTS urgency TEXT CHECK (urgency IN ('this_week', 'this_month', 'this_quarter', 'later', 'unknown')),
ADD COLUMN IF NOT EXISTS past_experience TEXT,
ADD COLUMN IF NOT EXISTS budget TEXT CHECK (budget IN ('confirmed', 'discussed', 'not_discussed', 'no_budget')),
ADD COLUMN IF NOT EXISTS paid_intent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ended_reason TEXT CHECK (ended_reason IN ('completed', 'voicemail', 'wrong_number', 'not_interested', 'callback_requested', 'max_duration', 'failed'));

-- Index for efficient polling queries
CREATE INDEX IF NOT EXISTS idx_calls_status_updated 
ON calls(call_status, updated_at) 
WHERE call_status IN ('ringing', 'in_progress');

-- Index for ended_reason queries
CREATE INDEX IF NOT EXISTS idx_calls_ended_reason 
ON calls(ended_reason) 
WHERE ended_reason IS NOT NULL;