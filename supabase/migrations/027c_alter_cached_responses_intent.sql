alter table if exists public.cached_responses
  drop constraint if exists cached_responses_intent_check;

alter table if exists public.cached_responses
  add constraint cached_responses_intent_check
  check (intent in ('FAQ_PROCESS','FAQ_FEES','FAQ_TRUST','FAQ_CONTRACT','FAQ_GENERAL','NEGOTIATION','EMOTIONAL'));
