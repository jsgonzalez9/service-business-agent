create table if not exists public.buyer_offers (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  buyer_id uuid references public.buyers(id) on delete set null,
  from_phone text,
  amount numeric,
  notes text,
  created_at timestamptz default now()
);
