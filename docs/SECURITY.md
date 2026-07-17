# Threat model and controls

## Assets

Provider credentials, the Supabase server secret, administrative sessions, contact data, RAG prompts/chunks and repository write access.

## Main threats

Credential leakage, XSS from repository content, prompt injection, unbounded LLM cost, webhook forgery, SSRF through screenshot URLs, CSRF/origin abuse, database exposure and supply-chain compromise.

## Controls

- `server-only` private modules and explicit public DTOs.
- Same-origin BFF routes; no authenticated provider request from the browser.
- CSP nonces, HSTS, restrictive permissions and frame/object blocking.
- Zod input validation, streamed byte limits that do not trust `Content-Length`, `no-store` API responses and production-safe errors.
- HMAC webhook verification and header-only revalidation secret.
- HTTPS/domain/DNS validation, private-network blocking and isolated Playwright context.
- RLS with anonymous denial, private schema grants and service-only vector/rate-limit functions.
- HMAC-anonymized IP identifiers and atomic server-side counters.
- Restricted RAG scope, mandatory evidence, injection rejection and generated-output secret filtering.
- Vercel firewall rate limiting in front of application-level atomic limits.
- Dependabot, CodeQL, Gitleaks, immutable Action SHAs, npm audit and client/server-bundle scanning.

## Incident response

Disable the affected integration, rotate the provider secret, invalidate Vercel previews if necessary, inspect private provider audit logs, remove exposed Git history only with an explicit coordinated procedure, and document the root cause before restoring service.

## Known limits

No public system is abuse-proof. Provider free tiers can disappear, Supabase Free may pause and heuristic scope classification can reject legitimate wording. Supabase-managed `supabase_admin` defaults are provider-owned; all application migrations are owned by the hardened `postgres` role and every current object was verified to deny anonymous access. These conditions fail safely and are monitored through sanitized status only.
