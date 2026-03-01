alter table if exists public.leads
  add column if not exists deal_state text default 'NEW' check (deal_state in ('NEW','CONTACTED','QUALIFIED','OFFER_SENT','NEGOTIATING','AGREED','CONTRACTED','DISPO','CLOSED','DEAD'));

alter table if exists public.leads
  add column if not exists state_entered_at timestamptz default now();

alter table if exists public.leads
  add column if not exists state_history jsonb default '[]'::jsonb;

alter table if exists public.leads
  add column if not exists offer_attempts integer default 0;

alter table if exists public.leads
  add column if not exists last_offer_amount decimal(12,2);

alter table if exists public.leads
  add column if not exists score integer default 0;

alter table if exists public.leads
  add column if not exists score_updated_at timestamptz;

create table if not exists public.message_metrics (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null,
  model text,
  tokens integer,
  cost numeric,
  confidence numeric,
  created_at timestamptz default now()
);
