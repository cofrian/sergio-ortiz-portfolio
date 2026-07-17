create index if not exists content_chunks_lexical_search_idx
  on public.content_chunks
  using gin (to_tsvector('simple', content));

create or replace function public.search_content_chunks(
  p_query text,
  p_count integer default 6
)
returns table (
  id uuid,
  document_id uuid,
  title text,
  public_url text,
  section text,
  content text,
  metadata jsonb,
  rank real
)
language plpgsql
stable
security definer
set search_path = public, pg_catalog
as $$
declare
  v_query tsquery;
begin
  if p_query is null or char_length(trim(p_query)) < 2 or char_length(p_query) > 500 then
    raise exception 'invalid search query';
  end if;
  if p_count < 1 or p_count > 12 then
    raise exception 'invalid result count';
  end if;

  v_query := websearch_to_tsquery('simple', left(p_query, 500));
  if numnode(v_query) = 0 then
    return;
  end if;

  return query
  select
    c.id,
    c.document_id,
    d.title,
    d.public_url,
    c.section,
    c.content,
    c.metadata,
    ts_rank_cd(to_tsvector('simple', c.content), v_query) as rank
  from public.content_chunks c
  join public.content_documents d on d.id = c.document_id
  where d.visibility = 'public'
    and d.approved_for_rag = true
    and to_tsvector('simple', c.content) @@ v_query
  order by rank desc, d.updated_at desc
  limit p_count;
end;
$$;

revoke all on function public.search_content_chunks(text, integer) from public, anon, authenticated;
grant execute on function public.search_content_chunks(text, integer) to service_role;

comment on function public.search_content_chunks(text, integer) is
  'Server-only lexical retrieval over approved public RAG chunks. Vector search remains available for same-model semantic retrieval.';
