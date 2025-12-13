alter table if exists public.leads
  add column if not exists buyer_contract_pdf_path text,
  add column if not exists buyer_price numeric;
