create table if not exists public.cached_responses (
  id uuid primary key default gen_random_uuid(),
  intent text not null check (intent in ('FAQ_PROCESS','FAQ_FEES','FAQ_TRUST','FAQ_CONTRACT','FAQ_GENERAL')),
  normalized_question text not null,
  canonical_question text,
  response_text text not null,
  embedding jsonb,
  usage_count integer default 0,
  last_used_at timestamptz,
  market text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists ux_cached_responses_intent_question
  on public.cached_responses (intent, normalized_question);

create table if not exists public.cached_hits (
  id uuid primary key default gen_random_uuid(),
  cached_response_id uuid not null references public.cached_responses(id) on delete cascade,
  question_raw text not null,
  matched_confidence float8 not null,
  created_at timestamptz not null default now()
);
