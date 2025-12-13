alter table if exists public.contract_templates
  add column if not exists docuseal_direct_link text;
