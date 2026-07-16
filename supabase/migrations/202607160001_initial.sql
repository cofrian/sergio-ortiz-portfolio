create extension if not exists vector with schema extensions;
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  repository text unique not null,
  payload jsonb not null,
  sync_hash text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.project_sources (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  public_url text not null check (public_url ~ '^https://'),
  section text not null,
  extracted_at timestamptz not null default now()
);

create table if not exists public.content_documents (
  id uuid primary key default gen_random_uuid(),
  source_type text not null,
  title text not null,
  public_url text not null check (public_url ~ '^https://'),
  visibility text not null default 'public' check (visibility = 'public'),
  approved_for_rag boolean not null default false,
  content_hash text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.content_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.content_documents(id) on delete cascade,
  section text not null,
  content text not null check (char_length(content) <= 12000),
  embedding extensions.vector(384) not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists content_chunks_embedding_hnsw on public.content_chunks using hnsw (embedding extensions.vector_cosine_ops);
create index if not exists content_chunks_document_id_idx on public.content_chunks(document_id);

create table if not exists public.linkedin_posts (
  id text primary key,
  payload jsonb not null,
  approved boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.sync_runs (
  id uuid primary key default gen_random_uuid(),
  status text not null,
  summary jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  encrypted_payload text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '90 days'
);

create table if not exists public.rate_limits (
  identifier_hash text not null,
  scope text not null,
  window_started_at timestamptz not null,
  request_count integer not null default 1 check (request_count >= 0),
  primary key (identifier_hash, scope, window_started_at)
);

alter table public.projects enable row level security;
alter table public.project_sources enable row level security;
alter table public.content_documents enable row level security;
alter table public.content_chunks enable row level security;
alter table public.linkedin_posts enable row level security;
alter table public.sync_runs enable row level security;
alter table public.contact_messages enable row level security;
alter table public.rate_limits enable row level security;

revoke all on all tables in schema public from anon, authenticated;
revoke all on all functions in schema public from anon, authenticated;

create or replace function public.consume_rate_limit(
  p_identifier text,
  p_scope text,
  p_limit integer,
  p_window_seconds integer
)
returns table (allowed boolean, remaining integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window timestamptz := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  v_count integer;
begin
  if p_limit < 1 or p_limit > 1000 or p_window_seconds < 1 or p_window_seconds > 86400 then
    raise exception 'invalid rate limit parameters';
  end if;
  insert into public.rate_limits(identifier_hash, scope, window_started_at, request_count)
  values (p_identifier, left(p_scope, 64), v_window, 1)
  on conflict (identifier_hash, scope, window_started_at)
  do update set request_count = public.rate_limits.request_count + 1
  returning request_count into v_count;
  return query select v_count <= p_limit, greatest(p_limit - v_count, 0);
end;
$$;

create or replace function public.match_content_chunks(
  p_embedding extensions.vector(384),
  p_threshold double precision,
  p_count integer
)
returns table (id uuid, document_id uuid, section text, content text, metadata jsonb, similarity double precision)
language sql stable security definer
set search_path = public, extensions
as $$
  select c.id, c.document_id, c.section, c.content, c.metadata, 1 - (c.embedding <=> p_embedding) as similarity
  from public.content_chunks c
  join public.content_documents d on d.id = c.document_id
  where d.visibility = 'public' and d.approved_for_rag = true and 1 - (c.embedding <=> p_embedding) >= p_threshold
  order by c.embedding <=> p_embedding
  limit least(greatest(p_count, 1), 8);
$$;

revoke all on function public.consume_rate_limit(text, text, integer, integer) from public, anon, authenticated;
revoke all on function public.match_content_chunks(extensions.vector, double precision, integer) from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, text, integer, integer) to service_role;
grant execute on function public.match_content_chunks(extensions.vector, double precision, integer) to service_role;
