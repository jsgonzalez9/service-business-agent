alter table if exists public.leads
  add column if not exists dispo_reviewed boolean default false,
  add column if not exists dispo_reviewed_at timestamptz;
