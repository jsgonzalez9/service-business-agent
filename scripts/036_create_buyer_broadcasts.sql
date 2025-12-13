create table if not exists public.buyer_broadcasts (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  buyer_id uuid references public.buyers(id) on delete set null,
  to_phone text not null,
  twilio_sid text,
  sent_at timestamptz default now()
);
