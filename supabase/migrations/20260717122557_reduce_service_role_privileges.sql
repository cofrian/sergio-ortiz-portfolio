-- Remove broad legacy privileges such as TRUNCATE, REFERENCES and TRIGGER.
-- Workflows and server routes only need ordinary record-level operations.
revoke all on all tables in schema public from service_role;

grant select, insert, update, delete on public.projects to service_role;
grant select, insert, update, delete on public.project_sources to service_role;
grant select, insert, update, delete on public.content_documents to service_role;
grant select, insert, update, delete on public.content_chunks to service_role;
grant select, insert, update, delete on public.linkedin_posts to service_role;
grant select, insert, update, delete on public.sync_runs to service_role;
grant select, insert, update, delete on public.contact_messages to service_role;

-- Rate-limit rows are reachable only through the bounded SECURITY DEFINER RPC.
revoke all on public.rate_limits from service_role;
grant execute on function public.consume_rate_limit(text, text, integer, integer) to service_role;
grant execute on function public.match_content_chunks(extensions.vector, double precision, integer) to service_role;
