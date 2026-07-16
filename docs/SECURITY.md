# Threat model and controls

## Assets

Provider credentials, Supabase service role, administrative sessions, contact data, RAG prompts/chunks and repository write access.

## Main threats

Credential leakage, XSS from repository content, prompt injection, unbounded LLM cost, webhook forgery, SSRF through screenshot URLs, CSRF/origin abuse, database exposure and supply-chain compromise.

## Controls

- `server-only` private modules and explicit public DTOs.
- Same-origin BFF routes; no authenticated provider request from the browser.
- CSP nonces, HSTS, restrictive permissions and frame/object blocking.
- Zod input validation, payload limits and production-safe errors.
- HMAC webhook verification and header-only revalidation secret.
- HTTPS/domain/DNS validation, private-network blocking and isolated Playwright context.
- RLS with anonymous denial and service-only vector/rate-limit functions.
- HMAC-anonymized IP identifiers and atomic server-side counters.
- Restricted RAG scope, mandatory evidence and injection rejection.
- Dependabot, CodeQL, Gitleaks, npm audit and client-bundle scanning.

## Incident response

Disable the affected integration, rotate the provider secret, invalidate Vercel previews if necessary, inspect private provider audit logs, remove exposed Git history only with an explicit coordinated procedure, and document the root cause before restoring service.

## Known limits

No public system is abuse-proof. Provider free tiers can disappear, Supabase Free may pause and heuristic scope classification can reject legitimate wording. These fail safely and are monitored through sanitized status only.
