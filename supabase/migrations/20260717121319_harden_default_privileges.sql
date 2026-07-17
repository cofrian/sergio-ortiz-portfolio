-- The browser never talks to Supabase. Keep the public schema private and grant
-- only the server-side service role the minimum access it needs.
revoke all on schema public from public, anon, authenticated;
grant usage on schema public to service_role;

revoke all on all tables in schema public from anon, authenticated;
revoke execute on all functions in schema public from public, anon, authenticated;

-- Supabase historically granted API roles access to newly created objects.
-- Opt out explicitly so future migrations fail closed until they grant access.
alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  revoke all on sequences from anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated, service_role;

-- Some Supabase-managed objects are owned by supabase_admin. Harden that owner
-- when the migration role is allowed to change its defaults.
do $$
begin
  if pg_has_role(current_user, 'supabase_admin', 'member') then
    execute 'alter default privileges for role supabase_admin in schema public revoke all on tables from anon, authenticated, service_role';
    execute 'alter default privileges for role supabase_admin in schema public revoke all on sequences from anon, authenticated, service_role';
    execute 'alter default privileges for role supabase_admin in schema public revoke execute on functions from public, anon, authenticated, service_role';
  end if;
end
$$;

-- Retain only the explicit server operations used by the application.
grant select, insert, update, delete on public.projects to service_role;
grant select, insert, update, delete on public.project_sources to service_role;
grant select, insert, update, delete on public.content_documents to service_role;
grant select, insert, update, delete on public.content_chunks to service_role;
grant select, insert, update, delete on public.linkedin_posts to service_role;
grant select, insert, update, delete on public.sync_runs to service_role;
grant select, insert, update, delete on public.contact_messages to service_role;
grant select, insert, update, delete on public.rate_limits to service_role;

alter function public.consume_rate_limit(text, text, integer, integer)
  set search_path = pg_catalog, public;
alter function public.match_content_chunks(extensions.vector, double precision, integer)
  set search_path = pg_catalog, public, extensions;

grant execute on function public.consume_rate_limit(text, text, integer, integer) to service_role;
grant execute on function public.match_content_chunks(extensions.vector, double precision, integer) to service_role;
