alter table if exists public.leads
  add column if not exists dispo_started_at timestamptz;

alter table if exists public.leads
  add column if not exists offers_received integer default 0;

alter table if exists public.leads
  add column if not exists best_assignment_fee numeric;

alter table if exists public.leads
  add column if not exists dispo_status text default 'pending' check (dispo_status in ('pending','no_interest','renegotiated','cancelled','sold'));
