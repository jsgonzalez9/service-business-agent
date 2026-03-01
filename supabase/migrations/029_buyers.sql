create table if not exists public.buyers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  created_at timestamptz default now()
);

create table if not exists public.buyer_interests (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.buyers(id) on delete cascade,
  zip text,
  asset_type text,
  price_min numeric,
  price_max numeric,
  rehab_tolerance text,
  created_at timestamptz default now()
);
