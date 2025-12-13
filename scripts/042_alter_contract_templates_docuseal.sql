alter table if exists public.contract_templates
  add column if not exists docuseal_template_id text;

alter table if exists public.leads
  add column if not exists seller_contract_status text,
  add column if not exists seller_contract_envelope_id text,
  add column if not exists seller_contract_signed_url text,
  add column if not exists buyer_contract_status text,
  add column if not exists buyer_contract_envelope_id text,
  add column if not exists buyer_contract_signed_url text;
