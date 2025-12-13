alter table if exists public.leads
  add column if not exists winning_buyer_id uuid references public.buyers(id) on delete set null;

alter table if exists public.leads
  add column if not exists assignment_pdf_path text;
