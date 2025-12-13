create extension if not exists vector;

alter table if exists public.cached_responses
  add column if not exists canonical_question text;

alter table if exists public.cached_responses
  add column if not exists embedding vector(1536);

alter table if exists public.cached_responses
  add column if not exists usage_count integer default 0;

alter table if exists public.cached_responses
  add column if not exists last_used_at timestamptz;

alter table if exists public.cached_responses
  add column if not exists market text;

-- optional ivfflat index for performance
do $$
begin
  if not exists (select 1 from pg_indexes where indexname = 'idx_cached_responses_embedding') then
    execute 'create index idx_cached_responses_embedding on public.cached_responses using ivfflat (embedding vector_cosine_ops) with (lists=100)';
  end if;
end$$;
